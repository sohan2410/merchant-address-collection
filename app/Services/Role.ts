import { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, } from "@ioc:Adonis/Lucid/Orm";
import { check } from 'acler'
import { default as _ } from 'lodash'
import RoleModel from 'App/Models/Role';
const Role = <T extends NormalizeConstructor<typeof BaseModel>>(superclass: T) => {
    return class extends superclass {
        public getRoles = async function () {
            const roles = await RoleModel.all()
            return roles.map(({ slug }) => slug)
        }

        public is = async function (expression) {
            const roles = await this.getRoles()
            return check(expression, operand => _.includes(roles, operand))
        }
    }
}
export default Role;