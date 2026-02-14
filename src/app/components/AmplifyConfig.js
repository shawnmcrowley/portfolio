'use client'

import { useEffect } from 'react'
import { Amplify } from 'aws-amplify'

export default function AmplifyConfig() {
  useEffect(() => {
    // Configure Amplify to use existing S3 bucket with unauthenticated Cognito access
    const config = {
      Auth: {
        identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
        region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
      },
      Storage: {
        AWSS3: {
          bucket: 'shawnmcrowley-bucket',
          region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
        }
      }
    }

    if (process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID) {
      Amplify.configure(config)
      console.log('Amplify configured for bucket: shawnmcrowley-bucket')
    } else {
      console.warn('AWS Identity Pool ID not configured. S3 operations will fail.')
    }
  }, [])

  return null
}
