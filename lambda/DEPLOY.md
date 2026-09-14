# SCOPE Club — AWS Lambda Deployment Guide

## Architecture

```
Browser (static S3 site)
  │
  ├─ GET  /          → S3 (index.html, events.html, etc.)
  │
  ├─ POST /chat      → API Gateway → Lambda: lambda/chat/index.js
  │                                         → AWS Bedrock (Claude)
  │
  └─ POST /contact   → API Gateway → Lambda: lambda/contact/index.js
                                             → Amazon SES → club inbox
```

No API keys are stored in environment variables or source code.  
Both Lambdas authenticate to AWS services via IAM execution roles.

---

## Prerequisites

- AWS account with access to:
  - Lambda (ap-south-1 or your preferred region)
  - API Gateway (HTTP API or REST API)
  - Amazon Bedrock (chat Lambda — enable Claude model access first)
  - Amazon SES (contact Lambda — verify sender domain/address first)
  - S3 + CloudFront (static site hosting)
- AWS CLI configured (`aws configure`)
- Node.js 18+ installed locally for packaging

---

## Step 1 — Enable Bedrock Model Access

1. Open the AWS Console → Bedrock → Model Access.
2. Enable: **Anthropic Claude 3.5 Sonnet v2** (model ID: `anthropic.claude-3-5-sonnet-20241022-v2:0`).
3. Note the region — Bedrock availability varies. `us-east-1` has the broadest availability.
4. If deploying to a different region, set `BEDROCK_REGION` accordingly.

---

## Step 2 — Verify SES Sender Address

1. Open AWS Console → SES → Verified Identities.
2. Create a verified identity for your sender address (e.g. `noreply@scope-mlrit.com`)  
   **or** verify the entire sending domain.
3. If your SES account is still in sandbox mode, also verify the destination address  
   (`scopeclub@mlrinstitutions.ac.in`) or request production access.
4. To request SES production access: SES Console → Account dashboard → Request production access.

---

## Step 3 — Create IAM Execution Roles

### Chat Lambda role — `scope-chat-lambda-role`

Attach these policies:

**AWSLambdaBasicExecutionRole** (managed — for CloudWatch logs)

**Custom inline policy — Bedrock invoke:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
    }
  ]
}
```
Replace the region and model ARN if different.

---

### Contact Lambda role — `scope-contact-lambda-role`

Attach these policies:

**AWSLambdaBasicExecutionRole** (managed)

**Custom inline policy — SES send:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ses:SendEmail",
      "Resource": "*"
    }
  ]
}
```
For tighter security, restrict `Resource` to the specific SES identity ARN.

---

## Step 4 — Package and Deploy Lambdas

Both Lambdas use `@aws-sdk/client-bedrock-runtime` and `@aws-sdk/client-ses`.  
Node.js 18+ Lambda runtimes include the AWS SDK v3, but it's safest to bundle dependencies:

```bash
# From the lambda/ directory:

# Chat Lambda
cd chat
npm init -y
npm install @aws-sdk/client-bedrock-runtime
zip -r ../chat-lambda.zip . ../shared/
# OR use AWS SAM / CDK for proper dependency management

# Contact Lambda
cd ../contact
npm init -y
npm install @aws-sdk/client-ses
zip -r ../contact-lambda.zip . ../shared/
```

Then deploy each zip via the AWS CLI:

```bash
# Create chat Lambda
aws lambda create-function \
  --function-name scope-chat \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/scope-chat-lambda-role \
  --handler index.handler \
  --zip-file fileb://lambda/chat-lambda.zip \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{
    BEDROCK_REGION=us-east-1,
    BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0,
    ALLOWED_ORIGINS=https://your-scope-domain.com
  }" \
  --region ap-south-1

# Create contact Lambda
aws lambda create-function \
  --function-name scope-contact \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/scope-contact-lambda-role \
  --handler index.handler \
  --zip-file fileb://lambda/contact-lambda.zip \
  --timeout 15 \
  --memory-size 128 \
  --environment Variables="{
    SES_REGION=ap-south-1,
    SES_FROM_EMAIL=noreply@scope-mlrit.com,
    CONTACT_TO_EMAIL=scopeclub@mlrinstitutions.ac.in,
    ALLOWED_ORIGINS=https://your-scope-domain.com
  }" \
  --region ap-south-1
```

---

## Step 5 — Create API Gateway (HTTP API)

1. AWS Console → API Gateway → Create API → HTTP API.
2. Add integrations:
   - `POST /chat`    → Lambda: `scope-chat`
   - `POST /contact` → Lambda: `scope-contact`
   - `OPTIONS /chat`    → return 204 (or configure CORS in API Gateway directly)
   - `OPTIONS /contact` → return 204
3. Configure CORS in API Gateway:
   - Allowed origins: `https://your-scope-domain.com`
   - Allowed methods: `POST, OPTIONS`
   - Allowed headers: `Content-Type`
4. Deploy the API → note the **Invoke URL** (e.g. `https://abc123.execute-api.ap-south-1.amazonaws.com`)

---

## Step 6 — Update Frontend Config

In `js/chatbot.js`, set the `CHAT_API_URL` constant to your API Gateway URL:

```js
const CHAT_API_URL = "https://abc123.execute-api.ap-south-1.amazonaws.com/chat";
```

In `js/forms.js`, update `FORM_ENDPOINT`:

```js
const FORM_ENDPOINT = "https://abc123.execute-api.ap-south-1.amazonaws.com/contact";
const STATIC_DEMO_MODE = false;  // Enable live submissions
```

---

## Step 7 — Host Static Site on S3 + CloudFront

```bash
# Create S3 bucket (choose a unique name)
aws s3 mb s3://scope-club-mlrit-site --region ap-south-1

# Enable static website hosting
aws s3 website s3://scope-club-mlrit-site \
  --index-document index.html \
  --error-document index.html

# Sync all static files (exclude Lambda source)
aws s3 sync . s3://scope-club-mlrit-site \
  --exclude ".git/*" \
  --exclude "lambda/*" \
  --exclude "node_modules/*" \
  --exclude "README.md" \
  --cache-control "max-age=86400"

# Make public (or use CloudFront OAC for private bucket + CDN)
aws s3api put-bucket-policy \
  --bucket scope-club-mlrit-site \
  --policy '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":"*",
      "Action":"s3:GetObject",
      "Resource":"arn:aws:s3:::scope-club-mlrit-site/*"
    }]
  }'
```

For production: create a CloudFront distribution pointing at the S3 bucket with:
- Custom error page: `/index.html` for 403/404 responses
- HTTPS only
- Appropriate cache policies

---

## Environment Variables Summary

| Lambda     | Variable           | Example value                                         |
|------------|--------------------|-------------------------------------------------------|
| chat       | BEDROCK_REGION     | `us-east-1`                                           |
| chat       | BEDROCK_MODEL_ID   | `anthropic.claude-3-5-sonnet-20241022-v2:0`           |
| chat       | ALLOWED_ORIGINS    | `https://scope-mlrit.com,https://www.scope-mlrit.com` |
| contact    | SES_REGION         | `ap-south-1`                                          |
| contact    | SES_FROM_EMAIL     | `noreply@scope-mlrit.com`                             |
| contact    | CONTACT_TO_EMAIL   | `scopeclub@mlrinstitutions.ac.in`                     |
| contact    | ALLOWED_ORIGINS    | `https://scope-mlrit.com,https://www.scope-mlrit.com` |

---

## Testing

```bash
# Test chat Lambda locally (requires AWS credentials)
echo '{"message":"What is SCOPE Club?","conversation":[]}' \
  | aws lambda invoke \
      --function-name scope-chat \
      --cli-binary-format raw-in-base64-out \
      --payload file:///dev/stdin \
      response.json \
  && cat response.json

# Test contact Lambda locally
echo '{"name":"Test User","email":"test@example.com","message":"Hello"}' \
  | aws lambda invoke \
      --function-name scope-contact \
      --cli-binary-format raw-in-base64-out \
      --payload file:///dev/stdin \
      response.json \
  && cat response.json

# HTTP test via curl (replace with your API Gateway URL)
curl -X POST https://YOUR_API_GW_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What events does SCOPE have?","conversation":[]}'
```

---

## Monitoring

- Lambda logs: CloudWatch Logs → `/aws/lambda/scope-chat` and `/aws/lambda/scope-contact`
- API Gateway metrics: CloudWatch → API Gateway → your API
- SES metrics: SES Console → Reputation dashboard

---

## Cost Estimate (low-traffic club site)

| Service    | Usage assumption             | Approx. monthly cost |
|------------|------------------------------|----------------------|
| Lambda     | 5,000 invocations/mo         | < $0.02              |
| API Gateway| 5,000 requests/mo            | < $0.02              |
| Bedrock    | ~100K input + 50K output toks| ~$1–3 (Claude 3.5 S) |
| SES        | 100 emails/mo                | < $0.01              |
| S3         | Static files ~50 MB          | < $0.01              |
| CloudFront | 1 GB transfer/mo             | < $0.10              |
| **Total**  |                              | **~$2–5/month**      |
