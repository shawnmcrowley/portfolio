# AWS S3 Setup Guide - Corrected Configuration

This guide explains how to configure your existing S3 bucket `shawnmcrowley-bucket` to work with the AWS Amplify-deployed application at **https://bradyrcrowley.publicvm.com**.

## Overview

- **Amplify Domain:** `https://bradyrcrowley.publicvm.com`
- **Bucket Name:** `shawnmcrowley-bucket`
- **Bucket Structure:**
  ```
  shawnmcrowley-bucket/
  ├── videos/          # Video files
  ├── pictures/        # Picture files
  └── metadata/        # JSON metadata file (will be created automatically)
  ```

## Important Clarification on Authentication

Since your app uses **localStorage-based OTP authentication** (not AWS Cognito User Pools), we have a simplified setup:

1. **Public Access (Viewing):** Uses Cognito Identity Pool with unauthenticated (guest) role
2. **Admin Access (Upload/Delete):** Uses the **same** unauthenticated role with write permissions

**Note:** This is acceptable for a personal portfolio site where only you have the OTP. For higher security, consider adding API Gateway + Lambda.

---

## Step 1: Configure S3 Bucket CORS

1. Go to **AWS S3 Console** → Select `shawnmcrowley-bucket`
2. Click **Permissions** tab
3. Scroll to **Cross-origin resource sharing (CORS)**
4. Click **Edit** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "https://bradyrcrowley.publicvm.com",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

5. Click **Save changes**

---

## Step 2: Create Cognito Identity Pool

1. Go to **Amazon Cognito** → **Identity pools** → **Create identity pool**

2. **Configure identity pool:**
   - Pool name: `portfolio-website-identity-pool`
   - **Authentication access:** Check **Enable access to unauthenticated identities** ONLY
   - **Do NOT enable authenticated identities** (we're using localStorage OTP, not AWS auth)

3. **Create IAM Role:**
   - Name it: `portfolio-website-unauth-role`
   - This will be the ONLY role created
   - Make sure the role has the necessary permissions (see Step 3)

4. **Save the Identity Pool ID** (format: `us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### ⚠️ Important Configuration Details:

When creating the Identity Pool, make sure:
- **"Enable access to unauthenticated identities"** is CHECKED ✓
- **"Enable access to authenticated identities"** is UNCHECKED ✗
- The unauthenticated role is created and attached to the pool

**Troubleshooting Tip:** If you get "undefined (reading loginWith)" error, it means:
1. The Identity Pool doesn't have guest access enabled, OR
2. The environment variables aren't set correctly, OR
3. The IAM role doesn't have proper S3 permissions

**To verify guest access is working:**
1. Open browser dev tools (F12)
2. Look for "Amplify configured successfully" in console
3. Check Network tab for any 403 Forbidden errors

---

## Step 3: Create IAM Policy for Unauthenticated Role

Since we only have one role that handles both viewing AND admin operations (protected by your OTP in the app):

1. Go to **IAM Console** → **Policies** → **Create policy**
2. Click **JSON** tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::shawnmcrowley-bucket",
        "arn:aws:s3:::shawnmcrowley-bucket/videos/*",
        "arn:aws:s3:::shawnmcrowley-bucket/pictures/*",
        "arn:aws:s3:::shawnmcrowley-bucket/metadata/*"
      ]
    },
    {
      "Sid": "AllowWriteAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::shawnmcrowley-bucket/videos/*",
        "arn:aws:s3:::shawnmcrowley-bucket/pictures/*",
        "arn:aws:s3:::shawnmcrowley-bucket/metadata/*"
      ]
    }
  ]
}
```

3. Name: `PortfolioWebsitePolicy`
4. Click **Create policy**

### Attach Policy to Role:

1. Go to **IAM Console** → **Roles**
2. Find `portfolio-website-unauth-role`
3. Click **Add permissions** → **Attach policies**
4. Search for and attach `PortfolioWebsitePolicy`
5. Click **Attach policies**

---

## Step 4: Configure S3 Bucket Policy

1. Go to **S3 Console** → `shawnmcrowley-bucket` → **Permissions** → **Bucket Policy**
2. Click **Edit** and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCognitoAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/portfolio-website-unauth-role"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::shawnmcrowley-bucket",
        "arn:aws:s3:::shawnmcrowley-bucket/*"
      ]
    }
  ]
}
```

**Replace:**
- `YOUR_ACCOUNT_ID` with your 12-digit AWS account ID
- Verify the role name matches exactly

3. Click **Save changes**

---

## Step 5: Configure Environment Variables in Amplify

### Via AWS Amplify Console:

1. Go to **AWS Amplify Console** → Your App → **Hosting** → **Environment variables**
2. Click **Manage variables** → Add:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

3. Click **Save**
4. **Trigger a new build:** Go to **Build settings** → Click **Redeploy this version**

---

## Step 6: Test the Configuration

### Production:

1. Visit: **https://bradyrcrowley.publicvm.com/videos**
   - Should show existing videos from S3
   
2. Visit: **https://bradyrcrowley.publicvm.com/pictures**
   - Should show existing pictures from S3

3. Visit: **https://bradyrcrowley.publicvm.com/login**
   - Login with OTP: `021612`
   
4. Go to Admin → Upload a test file
   - Should upload successfully to S3

### Local Development:

Create `.env.local`:
```bash
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Run: `npm run dev`

---

## Security Considerations

**Current Setup (One Role with Full Access):**
- ✅ Simple to configure
- ✅ Uses your OTP (021612) to protect admin UI
- ⚠️ Anyone with technical knowledge could potentially use the AWS credentials to write to S3
- ✅ Suitable for personal portfolio sites with low risk

**For Higher Security (Future Enhancement):**
Consider adding API Gateway + Lambda:
1. API Gateway endpoint for uploads
2. Lambda function validates OTP and uploads to S3
3. Frontend calls API Gateway instead of direct S3 access
4. This hides AWS credentials and adds server-side OTP validation

---

## Troubleshooting

### Issue: "Access Denied" errors

**Check:**
1. IAM policy attached to `portfolio-website-unauth-role`
2. Bucket policy has correct role ARN
3. CORS allows your domain
4. Identity Pool ID is correct in environment variables

### Issue: Files not showing

**Check:**
1. Files exist in `videos/` and `pictures/` folders (case-sensitive)
2. Identity Pool has unauthenticated access enabled
3. Browser console for specific error messages

### Issue: Cannot upload

**Check:**
1. IAM policy includes `s3:PutObject` permission
2. CORS allows PUT method
3. You're logged in with correct OTP

### Issue: "Cannot read properties of undefined (reading 'loginWith')"

This error means Amplify is trying to use authentication but the Identity Pool isn't configured for guest access.

**Solutions:**

1. **Verify Identity Pool Configuration:**
   - Go to Cognito → Identity pools → Your pool
   - Click "Edit identity pool"
   - Ensure "Enable access to unauthenticated identities" is CHECKED
   - Ensure "Enable access to authenticated identities" is UNCHECKED
   - Save changes

2. **Check Environment Variables:**
   - In Amplify Console → Environment variables
   - Verify `NEXT_PUBLIC_AWS_IDENTITY_POOL_ID` is set correctly
   - Format should be: `us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Redeploy after making changes

3. **Verify IAM Role Trust Policy:**
   - Go to IAM → Roles → Your unauth role
   - Check "Trust relationships" tab
   - Should include:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": {
         "Federated": "cognito-identity.amazonaws.com"
       },
       "Action": "sts:AssumeRoleWithWebIdentity",
       "Condition": {
         "StringEquals": {
           "cognito-identity.amazonaws.com:aud": "YOUR_IDENTITY_POOL_ID"
         },
         "ForAnyValue:StringLike": {
           "cognito-identity.amazonaws.com:amr": "unauthenticated"
         }
       }
     }]
   }
   ```

4. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

---

## Architecture (Simplified)

```
┌─────────────────────────────────────────────┐
│     AWS Amplify App                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Videos  │  │ Pictures │  │  Admin   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼────────────┼────────────┼──────────┘
        │            │            │
        └────────────┴────────────┘
                     │
            ┌────────▼─────────┐
            │ Cognito Identity │
            │ Pool (Unauth)    │
            └────────┬─────────┘
                     │
            ┌────────▼─────────┐
            │ IAM Role         │
            │ (Read + Write)   │
            └────────┬─────────┘
                     │
         ┌───────────▼───────────┐
         │ shawnmcrowley-bucket  │
         │  ├── videos/          │
         │  ├── pictures/        │
         │  └── metadata/        │
         └───────────────────────┘
```

**Admin protection:** Via OTP in app UI (021612)

### Quick Debugging Checklist

If you're still having issues, check these in order:

1. **Browser Console:**
   ```
   ✓ "Amplify configured successfully" message appears
   ✓ No red error messages about Cognito or S3
   ✓ Identity Pool ID is logged correctly
   ```

2. **Network Tab (F12 → Network):**
   ```
   ✓ Look for requests to `cognito-identity.us-east-1.amazonaws.com`
   ✓ Should return 200 with IdentityId
   ✓ No 403 Forbidden errors
   ```

3. **Environment Variables:**
   ```bash
   # In browser console, type:
   console.log(process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID)
   # Should print your identity pool ID
   ```

4. **IAM Role Permissions:**
   ```
   ✓ Role has S3 read permissions
   ✓ Role has S3 write permissions  
   ✓ Trust policy allows cognito-identity.amazonaws.com
   ✓ Trust policy has "unauthenticated" condition
   ```

---

## Summary of What We Fixed

✅ **Only ONE Cognito Identity Pool role needed** (unauthenticated)  
✅ **One IAM policy** with both read AND write permissions  
✅ **Your OTP (021612)** protects the admin UI  
✅ **Simplified bucket policy** with single role  

---

**Document Version:** 2.0  
**Last Updated:** 2026-02-14  
**Bucket:** shawnmcrowley-bucket  
**Domain:** https://bradyrcrowley.publicvm.com
