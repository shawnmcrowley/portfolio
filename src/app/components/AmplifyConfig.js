'use client'

import { useEffect } from 'react'
import { Amplify } from 'aws-amplify'

export default function AmplifyConfig() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID) {
      console.warn('AWS Identity Pool ID not configured. S3 operations will fail.')
      return
    }

    // Amplify v6 configuration for S3 with Cognito Identity Pool (guest access)
    const config = {
      Auth: {
        Cognito: {
          identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
          region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
          // Explicitly allow guest access
          allowGuestAccess: true
        }
      },
      Storage: {
        S3: {
          bucket: 'shawnmcrowley-bucket',
          region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
        }
      }
    }

    try {
      Amplify.configure(config)
      console.log('Amplify configured successfully for bucket: shawnmcrowley-bucket')
    } catch (error) {
      console.error('Error configuring Amplify:', error)
    }
  }, [])

  return null
}
