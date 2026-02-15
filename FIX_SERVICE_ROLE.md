# FIX: Service Role Issue with Cognito Identity Pool

## The Problem

Cognito created a **service role** instead of a regular IAM role. Service roles have different trust policies that don't work with Cognito Identity Pool's web identity federation, causing the "invalid storage bucket" error.

## The Solution

You have two options:

### Option 1: Update the Existing Service Role (Easier)

1. Go to **IAM Console** → **Roles**
2. Find the role that Cognito created (name like `portfolio-website-identity-poolUnauth_Role`)
3. Click on the role → **Trust relationships** tab
4. Click **Edit trust policy**
5. Replace the current policy with this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
    }
  ]
}
```

**Replace:** `YOUR_IDENTITY_POOL_ID` with your actual Identity Pool ID (e.g., `us-east-1:12345678-1234-1234-1234-123456789012`)

6. Click **Update policy**

### Option 2: Create a New Regular IAM Role (Recommended)

1. Go to **IAM Console** → **Roles** → **Create role**

2. **Select trusted entity:**
   - Trusted entity type: **Web identity**
   - Identity provider: **Cognito**
   - Audience: Enter your **Identity Pool ID** (e.g., `us-east-1:12345678-1234-1234-1234-123456789012`)
   - Click **Next**

3. **Add permissions:**
   - Click **Create policy** (opens new tab)
   - Click **JSON** and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
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

   - Name: `PortfolioS3AccessPolicy`
   - Click **Create policy**
   - Go back to Create role tab
   - Search for and select `PortfolioS3AccessPolicy`
   - Click **Next**

4. **Name the role:**
   - Role name: `portfolio-website-unauth-role`
   - Click **Create role**

5. **Update Cognito Identity Pool to use the new role:**
   - Go to **Cognito** → **Identity pools** → Your pool
   - Click **Identity pool properties**
   - Find **Unauthenticated identities**
   - Click **Edit**
   - Under **Unauthenticated role**, select your new role `portfolio-website-unauth-role`
   - Click **Save changes**

### Option 3: Update S3 Bucket Policy for Service Role (Quickest Test)

If you want to test quickly without changing the role, update the S3 bucket policy:

1. Go to **S3 Console** → `shawnmcrowley-bucket` → **Permissions** → **Bucket Policy**
2. Click **Edit** and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_SERVICE_ROLE_NAME"
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
- `YOUR_SERVICE_ROLE_NAME` with the actual service role name

3. Click **Save changes**

**Note:** This might still not work if the service role's trust policy doesn't allow Cognito.

---

## Verify the Fix

After making the changes:

1. **Redeploy your Amplify app** (environment variable changes require redeploy)

2. **Check browser console:**
   - Open https://bradyrcrowley.publicvm.com
   - Press F12 → Console
   - Should see: "Amplify configured successfully"
   - Should see: "Bucket: shawnmcrowley-bucket"

3. **Check Network tab:**
   - Look for requests to `cognito-identity.us-east-1.amazonaws.com`
   - Should return 200 status with IdentityId

4. **Test S3 access:**
   - Navigate to /videos or /pictures
   - Files should load from S3

---

## Common Issues

### "Cannot read properties of undefined (reading 'loginWith')"

**Cause:** The IAM role doesn't have the right trust relationship for Cognito web identity.

**Fix:** Use Option 1 or Option 2 above to fix the trust policy.

### "Access Denied" when listing files

**Cause:** IAM role doesn't have S3 permissions OR bucket policy blocks access.

**Fix:** 
- Check IAM role has S3 permissions
- Check bucket policy allows the role
- Check CORS is configured

### No network requests to cognito-identity

**Cause:** Amplify configuration error.

**Fix:**
- Check console for "Amplify configured successfully" message
- Verify environment variables are set in Amplify Console
- Hard refresh browser (Ctrl+Shift+R)

---

## Quick Debug Commands

Open browser console (F12) and run:

```javascript
// Check if Amplify is configured
console.log('Identity Pool:', process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID)

// Check if credentials are loaded
import { fetchAuthSession } from 'aws-amplify/auth';
fetchAuthSession().then(session => console.log('Session:', session));

// Check if S3 list works
import { list } from 'aws-amplify/storage';
list({ path: 'videos/' }).then(result => console.log('Files:', result));
```

---

## What We Fixed

✅ Updated AmplifyConfig.js with proper v6 format
✅ Added `buckets` configuration with path permissions  
✅ Added guest/authenticated access levels
✅ Provided three options to fix the service role issue
✅ Added debugging steps

The key issue was that Cognito created a service role, which doesn't work with web identity federation. You need a regular IAM role with the proper trust relationship that allows `cognito-identity.amazonaws.com` to assume the role.
