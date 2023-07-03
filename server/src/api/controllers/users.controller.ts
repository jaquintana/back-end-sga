import { ApplicationController } from './'


export class UsersController extends ApplicationController {
  constructor() {
    
    super('sys_user')
  }

  list(req, res) {
    return super._list(req, res)
  }
}
