# Quick Configuration Reference

## Application Domain
**https://bradyrcrowley.publicvm.com**

## S3 Bucket Details
- **Bucket Name:** `shawnmcrowley-bucket`
- **Videos Folder:** `videos/`
- **Pictures Folder:** `pictures/`
- **Metadata File:** `metadata/media-metadata.json`

## Required Environment Variables

Add these to your AWS Amplify Console:

```
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=your_identity_pool_id_here
```

And to your local `.env.local` file for development.

## S3 CORS Configuration

Apply this CORS policy to `shawnmcrowley-bucket`:

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

## IAM Setup (One Role Only)

Since we're using localStorage OTP (not AWS Cognito User Pools):

1. **Create ONE Cognito Identity Pool** with guest access only
2. **Create ONE IAM Role** (unauthenticated role)
3. **Attach ONE Policy** with both read AND write permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::shawnmcrowley-bucket",
        "arn:aws:s3:::shawnmcrowley-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": [
        "arn:aws:s3:::shawnmcrowley-bucket/videos/*",
        "arn:aws:s3:::shawnmcrowley-bucket/pictures/*",
        "arn:aws:s3:::shawnmcrowley-bucket/metadata/*"
      ]
    }
  ]
}
```

**Note:** The OTP (021612) in the app UI protects admin functions.

## Admin Access

- **Login URL:** https://bradyrcrowley.publicvm.com/login
- **OTP:** `021612`
- **Admin Panel:** https://bradyrcrowley.publicvm.com/admin

## File Upload Limits

- **Videos:** Max 50MB (MP4, AVI, MOV, WMV, WebM)
- **Pictures:** Max 10MB (JPEG, PNG, GIF, WebP)

## Testing Checklist

- [ ] CORS configured with domain
- [ ] Cognito Identity Pool created (guest access only)
- [ ] ONE IAM role created with read+write policy
- [ ] Bucket policy allows the role
- [ ] Environment variables set in Amplify
- [ ] Site loads at https://bradyrcrowley.publicvm.com
- [ ] Videos display from S3
- [ ] Pictures display from S3
- [ ] Admin login works with OTP 021612
- [ ] File upload works
- [ ] File delete works

## Important Notes

- **Only unauthenticated identities** are enabled in Cognito
- **One IAM role** handles both public viewing and admin operations
- **OTP protection** is in the app UI, not AWS
- **Suitable for:** Personal portfolio with low security requirements
- **For higher security:** Consider API Gateway + Lambda
