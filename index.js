const jp = require('../../../../current/node_modules/jsonpath')

const Base = require('../../../../current/core/server/adapters/sso/SSOBase')
const User = require('../../../../current/core/server/models/user').User

module.exports = class HeaderSSOAdapter extends Base {
    constructor(config) {
        super()

        this.config = config || {}
    }

    async getRequestCredentials(request) {
        if (request.originalUrl !== '/ghost/') {
            // For unknown reason this method called even on assets requests
            // Returning null here to avoid unnecessary database queries
            return null
        }

        const emailheadername = this.config.emailheader || 'Remote-Email'
        const usernameheadername = this.config.usernameheader || 'Remote-Username'
        const keyheadername = this.config.keyheader || 'Remote-Key'

        if(request.headers[keyheadername.toLowerCase()] !== this.config.key){
            return null
        }

        return {
            email: request.headers[emailheadername.toLowerCase()],
            username: request.headers[usernameheadername.toLowerCase()]
        }
    }

    async getIdentityFromCredentials(credentials) {
        return credentials
    }

    async getUserForIdentity(identity) {
        const { email, name } = identity;
        let user = await User.findOne({
            email,
            status: 'active'
        })
        if(!user){
            try {
                await User.add(
                    {
                        email,
                        name
                    },
                    {}
                );
                console.log('Admin SSO user added successfully.');
            } catch (err) {
                console.error('Error adding admin SSO user:', err);
            }
        }
    }
}
