import React from 'react'

type Props = {}

const AuthHeader = (props: Props) => {
  return (
    <div>
        <div className="space-y-1">
            <div className="text-2xl text-center">Sign in</div>
            <div className="text-center">
              Enter your email and password to login
            </div>
          </div>
    </div>
  )
}

export default AuthHeader