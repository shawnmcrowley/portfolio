'use client'

import { useEffect } from 'react'
import { Amplify } from 'aws-amplify'

export default function AmplifyConfig() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID) {
      console.warn('AWS Identity Pool ID not configured. S3 operations will fail.')
      return
    }

    // Amplify v6 configuration for S3 with custom bucket using guest access
    const config = {
      Auth: {
        Cognito: {
          identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
          region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
          allowGuestAccess: true
        }
      },
      Storage: {
        S3: {
          bucket: 'shawnmcrowley-bucket',
          region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
          // Configure the bucket with proper paths
          buckets: {
            'shawnmcrowley-bucket': {
              bucketName: 'shawnmcrowley-bucket',
              region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
              paths: {
                'videos/*': {
                  guest: ['get', 'list'],
                  authenticated: ['get', 'list', 'write', 'delete']
                },
                'pictures/*': {
                  guest: ['get', 'list'],
                  authenticated: ['get', 'list', 'write', 'delete']
                },
                'metadata/*': {
                  guest: ['get', 'list'],
                  authenticated: ['get', 'list', 'write', 'delete']
                }
              }
            }
          }
        }
      }
    }

    try {
      Amplify.configure(config)
      console.log('Amplify configured successfully')
      console.log('Bucket: shawnmcrowley-bucket')
      console.log('Identity Pool:', process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID)
    } catch (error) {
      console.error('Error configuring Amplify:', error)
    }
  }, [])

  return null
}
