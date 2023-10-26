import { ApplicationController } from './'
import { tokenController } from './tokenController';
import { cloneDeep } from "lodash";
/*Types*/
import { responseActionMenu } from '../../db/models/ui_menu.mode'
import { responseActionUrl } from '../../db/models/sys_action_url.model'
import { responseActionForm, ChildrenListModelType, Field, Group } from '../../db/models/sys_action_form';
import { mg_acceso_x_modelo_interface } from '../../db/models/mg_acceso_x_modelo';


export interface item {
  type: string,
  idx: number,
  idxAncestor: number,
  datamodel: any
  level: number
  create: boolean
  children: item[]
  overlay: string,
  class: string
  id: string
  groups: any[]
}


interface node2 {
  level: number,
  type: string;
  id: string,
  label: string,
  maxLengh: number,
  placeholder: string
  options: []
  value: string
  // field:field[];
  model: string;
  class: string;
  children: []
  group: [],
  required: boolean

}

export interface FuseNavigationItem {
  id: number;
  title?: string;
  subtitle?: string;
  action?: string;
  typeAction?: string;
  src_action?: number;
  model_id?: number
  value?: string;
  name?: string;
  rootMenuId?: number;
  sub_titulo: string;
  type?:
  7 | 'aside'
  | 'basic'
  | 'collapsable'
  | 'divider'
  | 'group'
  | 'spacer';
  hidden?: (item: FuseNavigationItem) => boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  externalLink?: boolean;
  target?:
  | '_blank'
  | '_self'
  | '_parent'
  | '_top'
  | string;
  exactMatch?: boolean;
  isActiveMatchOptions?: any;
  function?: (item: FuseNavigationItem) => void;
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  icon?: string;
  badge?: {
    title?: string;
    classes?: string;
  };
  children: FuseNavigationItem[];
  meta?: any;
}

export type FuseVerticalNavigationAppearance =
  | 'default'
  | 'compact'
  | 'dense'
  | 'thin';

export type FuseVerticalNavigationMode =
  | 'over'
  | 'side';

export type FuseVerticalNavigationPosition =
  | 'left'
  | 'right';



export class ActionMenuController extends ApplicationController {

  responseAction: responseActionMenu = {
    menu:
    {
      display_name: "",
      name: "",
      id: 0,
      active: false,
      child_id: 0,   //m2o
      parent_id: 0,
      model_id: 0,
      action: 0,
      order: 0,
      description: "",
      type: "none",

    }
  }

  constructor() {
    super('ui_menu')
  }
  private async validateUserGroup(user: number) {

    let result = await super._query("SELECT grupo_id FROM mg_grupo_x_usuario,mg_usuario WHERE mg_usuario.id=mg_grupo_x_usuario.usuario_id and mg_usuario.activo='S' and mg_usuario.eliminado='N' and mg_grupo_x_usuario.activo='S'  and mg_grupo_x_usuario.usuario_id =" + user)

    return result

  }
  private async getMenuRootAction(grupo: number[]) {

    let prueba = await super._query("SELECT mg_menu.modelo_id,mg_menu.descripcion,mg_menu.id,mg_menu.nombre,mg_grupo_x_menu.accion_id,accion,mg_menu.nombre_desplegado,icon,valor,mg_menu.padre_id FROM mg_menu,mg_grupo_x_menu WHERE mg_grupo_x_menu.menu_id=mg_menu.id and mg_grupo_x_menu.grupo_id IN(" + grupo + ")  and  mg_menu.activo='S' and mg_menu.padre_id is null")
    return prueba
  }

  /*private async getMenuRootModelAction(modelId:number)
  {
    let prueba= await super._query("SELECT ui_menu.model_id,ui_menu.descripcion,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor,mg_menu.padre_id FROM mg_menu WHERE  mg_menu.activo=1 and mg_menu.padre_id is null and model_id="+ modelId)
    return prueba
  }*/

  private async getMenuModel(model_id: number, action: number, grupo: number[]) {

    let rr = await super._query("SELECT distinct mg_menu.sub_titulo,mg_menu.type,mg_menu.modelo_id,padre_id,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor FROM mg_menu, mg_grupo_x_menu  where mg_grupo_x_menu.menu_id=mg_menu.id and mg_grupo_x_menu.grupo_id IN(" + grupo + ") and mg_menu.modelo_origen = " + model_id + " and  mg_menu.activo=1 and padre_id is null")


    return rr
  }


  async existChildren(fatherMenuId, grupo: number[]) {
    let childrens = await super._query("SELECT distinct mg_menu.sub_titulo,mg_menu.type,mg_menu.modelo_id,padre_id,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor FROM mg_menu,mg_grupo_x_menu  where  mg_grupo_x_menu.menu_id=mg_menu.id and mg_grupo_x_menu.grupo_id IN(" + grupo + ") and mg_menu.activo=1  and padre_id=" + fatherMenuId)
    if (childrens.data.length > 0)
      return true
    else
      return false

  }


  private createNode(item: any) {
    let Inode: FuseNavigationItem = {
      id: item.id,
      children: [],
      title: item.nombre_desplegado,
      subtitle: "",
      typeAction: item.type_action,
      active: true,
      disabled: false,
      icon: item.icon,
      model_id: item.modelo_id,
      action: item.accion_id,
      name: item.nombre,
      value: item.valor,
      type: item.type,
      sub_titulo: item.sub_titulo

    }


    return Object.assign({}, Inode)

  }


  private async getChildMenu(fatherMenuId: number, _node: FuseNavigationItem, grupo: number[]) {

    let siblings = await super._query("SELECT  distinct mg_menu.type,mg_menu.modelo_id,padre_id,mg_menu.id,mg_menu.nombre,mg_grupo_x_menu.accion_id,mg_menu.nombre_desplegado,icon,valor FROM mg_menu,mg_grupo_x_menu  WHERE mg_grupo_x_menu.menu_id=mg_menu.id and mg_grupo_x_menu.grupo_id IN(" + grupo + ") and mg_menu.activo=1  and mg_menu.padre_id=" + fatherMenuId)

    let i = 0
    let node: FuseNavigationItem

    if (siblings.data)
      while (siblings.data.length > i) {
        node = this.createNode(siblings.data[i])

        if (await this.existChildren(node.id, grupo)) {
          _node.children.push(await this.getChildMenu(node.id, node, grupo))
        } else {
          _node.children.push(node)
        }
        i++
      }
    return _node
  }

  private async getMainModelMenu(model_id: number, action: number, arrayGroupId: number[]) {
    let arrayMenu: FuseNavigationItem[] = []
    let menuModel = await this.getMenuModel(model_id, action, arrayGroupId)

    if (Array.isArray(menuModel.data)) {
      for (let i = 0; i < menuModel.data.length; i++) {
        let x = this.createNode(menuModel.data[i])
        let nodo = await this.getChildMenu(x.id, x, arrayGroupId)
        arrayMenu.push(cloneDeep(nodo))
      }
    } else {
      if (menuModel.data) {
        let x = this.createNode(menuModel.data)
        let nodo = await this.getChildMenu(x.id, x, arrayGroupId)

        arrayMenu.push(cloneDeep(nodo))

      }

    }

    let rootMenu = this.createNode({
      id: action,
      children: [],
      nombre_desplegado: 'root',
      subtitle: "",
      typeAction: "",
      active: true,
      disabled: false,
      icon: "",
      modelo_id: model_id,
      accion: action,
      nombre: "root",
      value: 0,
      type: 'root',
      sub_titulo: "root"
    })

    arrayMenu.forEach(item => {
      rootMenu.children.push(item)
    })

    return rootMenu
  }



  async actionMenu(req, res) {
    let _userRequerid = req.body.user_id
    let _actionNameRequerid = req.body.action
    let _modelId = 0
    let _actionId = 0
    let arrayGroup: number[] = []


    let resultGroup = await this.validateUserGroup(_userRequerid)

    if (resultGroup.error == null && resultGroup.data && resultGroup.data.length > 0) {

      if (_actionNameRequerid == "menu") {
        const _result = await this.getMainModelMenu(_modelId, _actionId, arrayGroup)
        const _rootMenu = await this.getMenuRootAction(arrayGroup)

        return res.status(200).json({ success: true, data: _rootMenu.data, errors: null })
      }
      if (_actionNameRequerid == "model") {
        _modelId = req.body.modelId
        _actionId = req.body.actionId

        resultGroup.data.forEach(item => arrayGroup.push(item.grupo_id))
        const _result = await this.getMainModelMenu(_modelId, _actionId, arrayGroup)

        return res.status(200).json({ success: true, data2: _result, data: "", errors: null })
      }
    }
    else {
      return res.status(200).json({ success: false, code: "AURL002", errors: [{ message: "No tiene asignado permisos el usuario" }] })
    }
  }
}


export class ActionUrlController extends ApplicationController {

  responseAction: responseActionUrl = {
    action: {
      id: 0,
      name: "",
      display_name: "",
      url: "",
      target: "",
      type_action: "",
      parameter: "",
      currentAction: 0,
    },

  }

  constructor() {

    super('mg_accion_navegar')

  }
  private async validateUserGroup(user: number) {
    return await super._query("SELECT grupo_id FROM mg_grupo_x_usuario WHERE  activo='S' and usuario_id =" + user)
  }

  private async validateActionUrl(actionName: string) {

    return await super._query("SELECT id,target,url,parameter,tipo_accion,nombre FROM mg_accion_navegar WHERE  nombre =" + "'" + actionName + "'")
  }

  async actionUrl(req, res) {

    let userRequerid = req.body.id
    let actionNameRequerid = req.body.action

    let resultGroup = await this.validateUserGroup(userRequerid)

    if (resultGroup.error == null && resultGroup.data) {
      let resultAction = await this.validateActionUrl(actionNameRequerid)
      if (Array.isArray(resultAction.data))
        resultAction.data = resultAction.data.shift()
      if (resultAction.error == null && resultAction.data) {
        this.responseAction.action.display_name = "",
          this.responseAction.action.id = resultAction.data.id
        this.responseAction.action.parameter = resultAction.data.parameter
        this.responseAction.action.url = resultAction.data.url
        this.responseAction.action.target = resultAction.data.target
        this.responseAction.action.name = resultAction.data.nombre
        this.responseAction.action.type_action = resultAction.data.tipo_accion
        this.responseAction.action.currentAction = resultAction.data.id

        return res.status(200).json({ success: true, data: this.responseAction, errors: null })
      }
      else {
        return res.status(200).json({ success: false, code: "AURL001", errors: [{ message: res.__("AURL001") }] })
      }
    }
    else {
      return res.status(200).json({ success: false, code: "AURL002", errors: [{ message: res.__("AURL002") }] })
    }
  }

}





export class ActionController extends ApplicationController {
  private level: number = 0
  items: item[] = []
  private raiz
  private childrenListArray: ChildrenListModelType[] = []
  private childrenListArray2: ChildrenListModelType[] = []
  private childrenList: ChildrenListModelType = {
    nameModel: "",
    id: "",
    type: "",
    foreignKey: [],
    data: [],
    nameColumns: {
      name: "",
      columns: []
    },
    groups: [],
    component: "",
    nivel: 0,
    one2many: "",
    color: "",
    action: "",
    icon: "",
    datatype: "",
    idaction: "",
    children: [],
    idx: 0,
    ancestor: 0,
    required: false
  }



  private column = {
    title: '',
    field: '',
    hozAlign: "center",
    sorter: "",
    type: '',
    datatype: '',
    sequence: -1,
  }

  private field = {
    name: '',
    type: '',
    datatype: '',
    sequence: 0,
    label: '',
    id: '',
    placeholder: '',
    maxlength: 10

  }
  private initResponseActionForm(): responseActionForm {
    return {
      id: 0,
      model: "",
      fullname: "",
      display_name: "",
      action: {
        action: "",
        viewMode: [""],
        viewForm: "",
        domain: "",
        typeAction: "",
        display_name: "",
        name: "",
        src_model: 0,
        res_model: 0,
        mode: ""
      },
      menu: [{}],
      data: [{}],
      model_fields: [{}],
      one2manydata: [{}],
      many2onedata: [{}],
      many2manydata: [{}],
      model_id: 0,
      total_row_model: 0,
      access: {},
      value: "",
      currentAction: 0,
      view: [{}],
      field: [{}],
      nameModel: "",
      childrenList: [],
      childrenList2: [],
      fieldBreadCrumb: "",
      mode: 'empty',
      pais: 0,
      idioma: 0,
      outlet: '',
      dataToSearch: null,
      parameter: [{}],
      extraData: [{}],
      paginacion: {},
      sort: {},
      filtros: []
    }

  }

  constructor() {
    super('mg_accion_forma')

  }




  private async validateUserGroup(user: number) {

    return await super._query("SELECT grupo_id FROM mg_grupo_x_usuario  WHERE activo='S' and usuario_id =" + user)

  }




  private async validateActionServer(action: number) {
    return await super._query("SELECT id,nombre,modelo_id,ref_id,tipo_accion_id,set_id FROM mg_accion_servidor WHERE  id =" + action)
  }

  private async validateGroupByView(group_id: number[], ui_view: number) {
    return await super._query("SELECT count(*) as total FROM mg_grupo_x_vista WHERE grupo_id IN(" + group_id + ") and vista_id =" + ui_view)
  }
  private async selectProceso(procesoId: number) {
    return await super._query("SELECT orden,id,nombre,nombre_desplegado  FROM pr_flujo_etapa WHERE eliminado='N' and activo='S' and id=" + procesoId)

  }

  private async validateGroupByActionForm(action_id: number, group_id: any[]) {
    var result = await super._query("SELECT count(*) as total FROM mg_grupo_x_accion_forma WHERE  accion_forma_id=" + action_id + " and grupo_id IN(" + group_id + ")")

    return result
  }

  private async validateActionByView(action_id: number, accion_name: string) {
    let result
    console.log("valida Action By View",action_id,accion_name)
    if (action_id)
      result = await super._query("SELECT a.vista_id,b.tipo_vista,b.path,b.fullpath,b.outlet FROM mg_accion_forma_x_vista as a JOIN mg_vista as b WHERE a.accion_forma_id = " + action_id + " and b.id=a.vista_id")
    else
      result = await super._query("SELECT a.vista_id,b.tipo_vista,b.path,b.fullpath,b.outlet FROM mg_accion_forma_x_vista as a JOIN mg_vista as b JOIN mg_accion_forma as  c WHERE c.nombre='" + accion_name + "' and c.id=a.accion_forma_id  and b.id=a.vista_id")


    return result
  }


  private async getFieldByModel(model_id: number) {

    return await super._query("SELECT mg_atributo_x_modelo.*,mg_atributo_tipo.nombre as type FROM mg_atributo_x_modelo JOIN mg_atributo_tipo WHERE modelo_id = " + model_id + " and mg_atributo_x_modelo.tipo_campo=mg_atributo_tipo.id")
  }

  private async getGeneral(base_de_datos: number) {
    let result = await super._query("SELECT pais_id,idioma_id FROM mg_configuracion_general  WHERE base_de_datos = " + base_de_datos)

    return result

  }


  async getDataModelCat(idModelo: number) {
    var a
    const models = await super._query("SELECT a.modelo,b.padre_id,b.llaveforanea,contexto from mg_modelo a JOIN mg_one2many b where a.id=b.padre_id and b.modelo_id= " + idModelo)
    a = models.data.map(async item => {
      let data = await super._query("SELECT " + item.contexto + " from " + item.modelo + " WHERE  activo='S' and eliminado='N'")
      item["data"] = data.data
      return item
    })
    return await Promise.all(a)
  }

  async getDataModelmany2one(idModelo: number, foreignKey: any, grupo: any) {
    var array: any[] = []
    var a
    const models = await super._query("SELECT a.modelo,b.modelo_id,b.llaveforanea,contexto from mg_modelo a JOIN mg_many2one b where a.id=b.modelo_id and b.padre_id= " + idModelo)
    for (let i = 0; i < grupo.length; i++) {
      array.push(grupo[i].grupo_id)
    }
    
    a = models.data.map(async item => {
      let data = await super._query("SELECT " + item.contexto + " from " + item.modelo + " WHERE  activo='S' and eliminado='N' and " + item.llaveforanea + "= '" + foreignKey + "'")
      item["data"] = data.data
      item['fields'] = (await super._query("SELECT b.origen_campo,b.valor_defecto,b.nombre,b.index,b.sololectura,b.requerido,b.tamano,c.nombre  as tipo,b.nombre_desplegado,  b.json from  mg_atributo_x_modelo as b,mg_atributo_tipo as c  WHERE  b.tipo_campo=c.id and b.activo='S' and b.modelo_id = " + item.modelo_id)).data
      item['access'] = (await super._query("SELECT lectura,escritura,elimina,agrega from mg_acceso_x_modelo where activo='S' and eliminado='N' and modelo_id=" + item.modelo_id + " and grupo_id in (" + array + ")")).data

      return item
    })

    return await Promise.all(a)
  }


  async getInDataModelmany2one(idModelo: number, data: any): Promise<any> {
    var item
    var item2
    var resultado
    var fields: any
    var resultadoArreglo: any[] = []
    var resultadoTotalArreglo: any[] = []


    var models = await super._query("SELECT b.todas_llaveforanea,a.modelo,b.modelo_id,b.llaveforanea,contexto from mg_modelo a JOIN mg_many2one b where a.id=b.modelo_id and b.padre_id= " + idModelo)

    for (let i = 0; i < data.length; i++) {
      item2 = data[i]
      for (let x = 0; x < models.data.length; x++) {
        item = models.data[x]
        resultadoArreglo = []
        resultado = await super._query("SELECT " + item.contexto + " from " + item.modelo + " WHERE  activo='S' and eliminado='N' and " + item.llaveforanea + "= '" + item2.id + "'")
        // fields  = await super._query("SELECT b.origen_campo,b.valor_defecto,b.nombre,b.index,b.sololectura,b.requerido,b.tamano,c.nombre  as tipo,b.nombre_desplegado,  b.json from  mg_atributo_x_modelo as b,mg_atributo_tipo as c  WHERE  b.tipo_campo=c.id and b.activo='S' and b.modelo_id = "+ idModelo)  
        if (resultado && resultado.data.length > 0)

          //  resultadoArreglo.push(cloneDeep(resultado.data))

          resultadoTotalArreglo.push({ llave: models.data[x].llaveforanea, todas_llaves: models.data[x].todas_llaveforanea, data: resultado.data, fields: fields })

      }

    }

    return await Promise.all(resultadoTotalArreglo)
  }

  /*esta rutina es utilizada cuando*/
  async getAllDataModelmany2one(idModelo: number, data: any) {
    var a
    var item
    var resultado
    var resultadoArreglo: any[] = []
    const models = await super._query("SELECT a.modelo,b.modelo_id,b.llaveforanea,contexto from mg_modelo a JOIN mg_many2one b where a.id=b.modelo_id and b.padre_id= " + idModelo)

    for (let i = 0; i < models.data.length; i++) {
      item = models.data[i]
      for (let x = 0; x < data.length; x++) {
        resultado = await super._query("SELECT " + item.contexto + " from " + item.modelo + " WHERE  activo='S' and eliminado='N' and " + item.llaveforanea + "= '" + data[x].id + "'")
        resultadoArreglo.push(resultado.data)
      }

    }
    return await Promise.all(resultadoArreglo)
  }

  async extraData(vistaId: number, dataToSearch: any, grupo: any) {
    let array: any[] = []
    const modelos = await super._query("SELECT  id,tipo,modelo_sql,modelo_id,contexto,dominio,nombre from mg_datos_modelo_x_vista where activo='S' and eliminado='N' and vista_id= " + vistaId)

    //console.log("access1", vistaId, grupo, dataToSearch)

    for (let i = 0; i < grupo.length; i++) {
      array.push(grupo[i].grupo_id)
    }

    let arrayResultado: any[] = []
    for (let i = 0; i < modelos.data.length; i++) {

      const modelo = modelos.data[i]

      if (modelo.dominio == null || !modelo.dominio || modelo.dominio == 'null') {
        const resultado = await super._query(modelo.modelo_sql)
        const access = await super._query("SELECT lectura,escritura,elimina,agrega from mg_acceso_x_modelo where activo='S' and eliminado='N' and modelo_id=" + modelo.modelo_id + " and grupo_id in (" + array + ")")
        //console.log("access2", array, modelos.data[i].nombre, modelo.modelo_id, resultado)
        arrayResultado.push(cloneDeep({ modelo: modelos.data[i].nombre, data: resultado.data, access: access.data }))
      }
      else {
        let l_c_fields: any
        let access: any
        if (modelo.modelo_id > 0) { // se necesitan los campos del modelo que se ha parametrizado.
          l_c_fields = await super._query("SELECT b.origen_campo,b.valor_defecto,b.nombre,b.index,b.sololectura,b.requerido,b.tamano,c.nombre  as tipo,b.nombre_desplegado,  b.json from  mg_atributo_x_modelo as b,mg_atributo_tipo as c  WHERE  b.tipo_campo=c.id and b.activo='S' and b.modelo_id = " + modelo.modelo_id)
          access = await super._query("SELECT lectura,escritura,elimina,agrega from mg_acceso_x_modelo where activo='S' and eliminado='N' and modelo_id=" + modelo.modelo_id + " and grupo_id in (" + array + ")")
          //      console.log("select access",access,array,modelo,"SELECT lectura,escritura,elimina,agrega from mg_acceso_x_modelo where activo='S' and eliminado='N' and modelo_id="+ modelo.modelo_id+ " and grupo_id in ("+array+")")
        }

        const dominio = await super.parse(modelo.dominio, null, dataToSearch)
        const dominioA = modelo.modelo_sql + ' and ' + dominio
        const resultado = await super._query(dominioA)
        //console.log("access2", modelos.data[i].nombre, modelo.modelo_id, resultado, dominioA)

        if (modelos && modelos.data.length > 0)
          arrayResultado.push(cloneDeep({ modelo: modelos.data[i].nombre, data: resultado.data, campos: l_c_fields?.data, access: access?.data }))
        else
          arrayResultado.push(cloneDeep({ modelo: "", data: resultado.data, campos: l_c_fields?.data, access: access?.data }))
      }
    }

    return arrayResultado
  }


  async many2ManyData(idModelo: number, vista: number, dataToSearch: any) {
    let arreglo: any[] = []
    var modelo
    var modeloa
    var modeloc
    var llave
    var fila
    var llaveExtranjera


    //busco todas las tuplas que correspnden a ese modelo ya sea pivote izquierdo o derecho en many2many
    const modelos = await super._query("SELECT  modelo_a_id,modelo_b_id,modelo_c_id,llave_modelo_a_id,llave_modelo_c_id,llave_modelo_b_id from  mg_many2many  where  modelo_a_id=" + idModelo + ' or ' + "modelo_b_id=" + idModelo)



    //filtra que existan camos  de la vista relacionados, que este en la vista, que sea forraneo en otro modelo, seran campos virtuales/ de lo contrario ya no proyecta nada.
    const campos = await super._query("SELECT  b.id,b.nombre  from  mg_modelo_x_atributo_x_vista a JOIN mg_atributo_x_modelo b where b.campo_relacionado=1 and llave_foranea=2 and b.id=a.modelo_x_atributo_id and a.vista_id=" + vista + " and a.activo='S' and a.eliminado='N' and b.activo='S' and b.eliminado='N'")



    //buscara todos los datosque corresponden a cada campo de la vista que representa una llave foranea.
    for (let i = 0; i < campos.data.length; i++) {
      //filtra aquellos modelos que tienen el campo que se desplegara en la viata (por ejemplo groupo_id de la tabla mg_usuario que se desplegara en la vista)
      modeloa = await modelos.data.find((item) => item.llave_modelo_a_id == campos.data[i].nombre)
      modeloc = await modelos.data.find(item => item.llave_modelo_c_id == campos.data[i].nombre)
      llaveExtranjera = await modelos.data.map((item => { if (item.modelo_a_id == idModelo) return item.llave_modelo_a_id })).shift()
      if (!llaveExtranjera)
        llaveExtranjera = await modelos.data.map(item => { if (item.modelo_c_id == idModelo) return item.llave_modelo_c_id }).shift()


      if (modeloa) {
        modelo = await super._query("select nombre from mg_modelo where id=" + modeloa['modelo_a_id'])
        llave = modeloa.llave_modelo_a_id
        fila = modeloa
      }
      if (modeloc) {
        modelo = await super._query("select nombre from mg_modelo where id=" + modeloc['modelo_c_id'])
        llave = modeloc.llave_modelo_c_id
        fila = modeloc
      }
      else
        return
      //obtiene la data que correponde a la tabla de muchos a muchos

      const modeloPivote = await super._query("select nombre from mg_modelo where id=" + fila.modelo_b_id)
      let arrayKey: string[] = []
      const data = await super._query("select " + "b.id, " + llave + ", " + llaveExtranjera + ", " + " nombre from " + modelo['data'][0].nombre + " as a JOIN " + modeloPivote.data[0].nombre + " as b where a.activo='S' and b.activo='S' and b." + llave + "=a.id and b." + llaveExtranjera + "=" + dataToSearch.id)
      arrayKey.push(llave)
      arrayKey.push(llaveExtranjera)
      arreglo.push({ arrayKey: arrayKey, "modelo": modeloPivote.data[0].nombre, "campo": campos.data[i].nombre, data: data['data'] })

    }

    return arreglo

  }




  private async getMenuModel(model_id: number) {
    return await super._query("SELECT padre_id,mg_menu.id,mg_menu.nombre,accion,mg_menu.nombre_desplegado,icon,valor,type_action FROM mg_menu JOIN sys_action ON  mg_menu.modelo_id=" + model_id + " and mg_menu.activo=1 and mg_menu.accion=sys_action.id")
  }

  private async getComponentView(extern_id: string) {
    return await super._query("SELECT name,fullpath FROM  ui_type_object_view  WHERE extern_id=" + "'" + extern_id + "'")
  }






  //private async this.super._query()





  private async getEnumModelData(modelName: string, field: string) {
    const firstDomain = "SELECT model,id FROM sys_model WHERE name=" + "'" + modelName + "'"
    const result = await super._query(firstDomain)
    const secondDomain = "SELECT enumfield FROM sys_model_enum WHERE model=" + result.data[0].id + " and namefield =" + "'" + field + "'"
    return await super._query(secondDomain)
  }



  private async getDataModelFieldByName(modelName: string, columns: any, responseAction: responseActionForm) {

    let _columns = columns["columns"]
    let firstDomain = "SELECT model,id FROM sys_model WHERE name=" + "'" + modelName + "'"
    let result = await super._query(firstDomain)

    let one2many = "SELECT foreignKey_id FROM sys_one2many WHERE children_id=" + "'" + result.data[0].id + "'"
    let foreignKey = await super._query(one2many)

    let seconDomain = ""
    let arrayColumns = ""
    let condition = ""

    for (let i = 0; i < _columns.length; i++) {
      i < _columns.length - 1 ? arrayColumns = arrayColumns + _columns[i].field + ',' : arrayColumns = arrayColumns + _columns[i].field
    }
    seconDomain = 'SELECT ' + arrayColumns + ' FROM sys_model_field' + ' WHERE'
    condition = foreignKey.data[0].foreignKey_id + " = " + result.data[0].id
    seconDomain = seconDomain + " " + condition

    result = await super._query(seconDomain)
    return result.data
  }

  private async getDataModelFieldByName2(modelName: string, columns: any, responseAction: any) {


    let _columns = columns["columns"]
    let one2many = "SELECT foreignKey_id FROM sys_one2many WHERE children_id=" + responseAction.res_model + ' and father_id=' + responseAction.src_model
    let foreignKey = await super._query(one2many)
    let firstDomain = "SELECT model,id FROM sys_model WHERE name=" + "'" + modelName + "'"
    let result = await super._query(firstDomain)

    let seconDomain = ""
    let arrayColumns = ""
    let condition = ""


    for (let i = 0; i < _columns.length; i++) {
      i < _columns.length - 1 ? arrayColumns = arrayColumns + _columns[i].field + ',' : arrayColumns = arrayColumns + _columns[i].field
    }

    seconDomain = 'SELECT ' + arrayColumns + ' FROM sys_model_field' + ' WHERE'
    if (foreignKey.data.length == 0) {
      condition = 'model_id' + " = " + result.data[0].id
    } else
      condition = foreignKey.data[0].foreignKey_id + " = " + result.data[0].id
    seconDomain = seconDomain + " " + condition
    result = await super._query(seconDomain)

    return result.data
  }

  private async getSelectDataModelFieldByName(modelName: string, columns: any) {

    let _columns = columns["columns"]
    const firstDomain = "SELECT model,id FROM sys_model WHERE name=" + "'" + modelName + "'"
    const result = await super._query(firstDomain)

    let seconDomain = ""
    let arrayColumns = ""
    for (let i = 0; i < _columns.length; i++) {
      i < _columns.length - 1 ? arrayColumns = arrayColumns + _columns[i].field + ',' : arrayColumns = arrayColumns + _columns[i].field
    }
    seconDomain = 'SELECT ' + arrayColumns + ' FROM ' + result['data'][0].model
    seconDomain = seconDomain
    const result2 = await super._query(seconDomain)
    return result2.data

  }

  private async getDataModelByName(modelName: string, foreignKey: string, columns: any) {
    let _columns = columns["columns"]
    let firstDomain = "SELECT model,id FROM sys_model WHERE name=" + "'" + modelName + "'"
    let result = await super._query(firstDomain)
    let seconDomain = ""
    let arrayColumns = ""
    let condition = ""



    for (let i = 0; i < _columns.length; i++) {

      i < _columns.length - 1 ? arrayColumns = arrayColumns + _columns[i].field + ',' : arrayColumns = arrayColumns + _columns[i].field
    }

    seconDomain = "SELECT " + seconDomain + " " + arrayColumns + ' FROM ' + result.data[0].model + ' WHERE'

    // for (let i=0;i<foreignKey.length;i++){
    condition = foreignKey + " = " + result.data[0].id
    // }
    seconDomain = seconDomain + " " + condition
    result = await super._query(seconDomain)
    return result.data

  }

  private async getDataModelById(modelName: string, foreignKey: string, columns: any, id: number) {

    let _columns = columns["columns"]
    let firstDomain = "SELECT model,id FROM sys_model WHERE name=" + "'" + modelName + "'"
    let result = await super._query(firstDomain)
    let secondDomain = ""
    let arrayColumns = "id,"
    let condition = ""

    for (let i = 0; i < _columns.length; i++) {
      i < _columns.length - 1 ? arrayColumns = arrayColumns + _columns[i].field + ',' : arrayColumns = arrayColumns + _columns[i].field
    }
    secondDomain = "SELECT " + secondDomain + " " + arrayColumns + ' FROM ' + result.data[0].model + ' WHERE'

    //for (let i=0;i<foreignKey.length;i++){
    condition = condition + foreignKey + " = " + id
    //}

    secondDomain = secondDomain + " " + condition

    result = await super._query(secondDomain)

    return result.data

  }


  async getDataChildFormById(req, res, resp) {
    let childrenList = req.body
    try {
      for (let i = 0; i < childrenList.length; i++) {

        if (childrenList[i].one2many.length > 0 && childrenList[i].foreignKey.length > 0) {
          const r = await this.getDataModelById(childrenList[i].nameModel, childrenList[i].foreignKey, childrenList[i].columns, childrenList[i].id)

          childrenList[i]['data'] = [...r]
        }
      }
      return res.status(200).json({ success: true, data: childrenList, errors: null })
    }
    catch (error) {
      return res.status(200).json({ success: false, code: "AURL002", errors: [{ message: res.__("AURL002") }] })
    }
  }


  private async getCountRowDataModel(model_name: string) {
    let result = await super._query("SELECT count(*) as total FROM " + model_name)

    return result
  }


  async dataList(req, res) {


    let userRequerid = req.body.user_id;
    let model   = req.body.model;
    let domain  = req.body.domain;
    let context = req.body.context


    let resultGroup = await this.validateUserGroup(userRequerid)
    if (resultGroup.error == null && resultGroup.data && resultGroup.data.length > 0) {
      let resultData = await super.xfindAll(model, domain, context)

      return res.status(200).json({ success: true, data: resultData, errors: null })
    }
  }


  parseOutlet(outlet, parameter) {

    let str = outlet
    let result1: string = ''
    for (let k in parameter) {
      var reg = new RegExp(k, "gi");
      let _str: string = parameter[k].toString()
      result1 = str.replace(reg, parameter[k]);
    }
    return JSON.parse(result1)
  }







  seleccionarProceso() {



  }

  async actionPaginationForm(req, res) {

    var id = req.body.id
    var actionRequerid = req.body.actionId
    var actionRequeridName = req.body.actionName
    var dataToSearch = req.body.dataToSearch
    var routerParametros = req.body.parameter
    var sort = req.body.sort
    const tamanoPagina = req.body.pagination.tamanoPagina
    const indicePagina = req.body.pagination.indicePagina

    //var resultGroup=await this.validateUserGroup(id)
    var resultGroup: any = await this.validateUserGroup2(id, actionRequerid, actionRequeridName)
    if (resultGroup.error == null && resultGroup.data && resultGroup.data.length > 0) {
      const resultAction = await super.validateAction(actionRequerid, actionRequeridName, id)

      resultGroup = resultGroup.data.filter(item => item.grupo_id == resultAction.data[0].grupo_id)

      if (resultAction) {

        const _resultAction = resultAction.data.shift()
        const resultModel = await super.getActionModel(_resultAction.respuesta_modelo)
        const resultAccess = (await super.accessModel(_resultAction.respuesta_modelo, resultGroup[0].grupo_id)).data[0]
        const parseDominio = await super.parseDominio(_resultAction.dominio, id, dataToSearch, _resultAction.dominio_sjoin)
        const _responseModel = resultModel.data.shift()


        //  const dataModel=await this.getDataModel(null,resultGroup.data[0].grupo_id,_responseModel.modelo,'empty',_resultAction.vista_id,tamanoPagina,indicePagina,sort,null)    
        if (_resultAction.dominio != 'empty' && _resultAction.dominio != 'All') {

          const dataModel = await super.getDataModel(resultAccess.regla, resultGroup, _responseModel.modelo, parseDominio, _resultAction.vista_id, tamanoPagina, indicePagina, sort, _resultAction.sjoin, "",'')
          return res.status(200).json({ success: true, data: { action: _resultAction.id, data: dataModel.data, paginacion: { pagina: tamanoPagina, idxPagina: indicePagina }, sort: sort }, errors: null })
        }
      }
    }
  }

  async actionForm(req, res) {
    console.log("actifon Form")
    let responseAction: responseActionForm = Object.assign({}, this.initResponseActionForm())
    let id = req.body.id
    let actionRequerid = req.body.actionId
    let actionRequeridName = req.body.actionName
    var dataToSearch = req.body.dataToSearch
    var routerParametros = req.body.parameter
    /****local variables */
    let dataModel: any;
    let resultAccess: mg_acceso_x_modelo_interface;
    let resultModel: any
    let resultForm: any
    let resultView: any
    let one2manyData
    let many2manyData
    let many2oneData
    let extraData
    let resultFieldByModel: any
    var resultGroup: any = await super.validateUserGroup2(id, actionRequerid, actionRequeridName)
    console.log("actifon Form-2",resultGroup,actionRequerid,actionRequeridName)
    if (resultGroup.error == null && resultGroup.data && resultGroup.data.length > 0) {
       const resultAction = await super.validateAction(actionRequerid, actionRequeridName, id)
       console.log("result Action",resultAction)
      if (resultAction.data.length > 0 && resultAction.data[0].grupo_id > 0) {
         resultGroup = resultGroup.data.filter(item => item.grupo_id == resultAction.data[0].grupo_id)
        if (resultAction.error == null && resultAction.data && resultAction.data.length > 0)
           if (resultGroup.length >= 1) { //aqui se cambio a mayor o igual a uno, ya que puede ser mas de un group_id
              let arrayGroup: number[] = []
              resultGroup.forEach(item => arrayGroup.push(item.grupo_id))
              const resultGroupAction = await this.validateGroupByActionForm(resultAction.data[0].id, arrayGroup)
              if (resultGroupAction && resultGroupAction.data.length > 0 && resultGroupAction.data[0].total > 0) { //yes, have permissions to action
                  resultForm = await this.validateGroupByView(arrayGroup, resultAction.data[0].vista_id)
                  resultView = await this.validateActionByView(actionRequerid, actionRequeridName)
                  if ((resultView && resultView.data.length>=1 && resultView.data[0].total<=0))
                      return res.status(200).json({ success: false, data: null, errors: [{ message: "Error verifique que la accion haya sido parametrizada con la vista" }] })
                  if (resultForm && resultForm.data.length>=1 && resultForm.data[0].total<=0)
                      return res.status(200).json({ success: false, data: null, errors: [{ message: "Error verifique el grupo al que pertenece el usuario tenga acceso a la vista" }] })  
                  console.log("resul view",resultView)  
                  if (!resultView || (resultView && !resultView.data) || (resultView && resultView.data && resultView.data.length<=0)) 
                      return res.status(200).json({ success: false, data: null, errors: [{ message: "Error verifique la vista parametrizada, no existe" }] })  

                  if (resultView && resultView.data && resultView.data.length>0 && resultView.data[0].outlet) 
                      resultView.data[0].outlet = this.parseOutlet(resultView.data[0].outlet, routerParametros)
                  if (resultForm.error == null && resultAction.data && resultForm.data.length > 0 && resultForm.data[0].total>=0) {
                      resultModel = await super.getActionModel(resultAction.data[0].respuesta_modelo)
                      if (resultModel.data && resultModel.data.length > 0) {
                          resultFieldByModel   = await this.getFieldByModel(resultAction.data[0].respuesta_modelo)
                          resultAccess         = (await super.accessModel(resultAction.data[0].respuesta_modelo, resultGroup[0].grupo_id)).data[0]
                          const resultMenu     = await this.getMenuModel(resultAction.data[0].respuesta_modelo)
                          const _resultAction  = resultAction.data.shift()
                          const _responseModel = resultModel.data.shift()
                      if (resultAccess && resultAccess.lectura) {
                          extraData = await this.extraData(resultView.data[0].vista_id, dataToSearch, resultGroup)
                          if (_resultAction.dominio != 'empty' && _resultAction.dominio != 'All') {
                                const parseDominio  = await super.parseDominio(_resultAction.dominio, id, dataToSearch, _resultAction.dominio_sjoin)
                                      dataModel     = await super.getDataModel(resultAccess.regla, resultGroup, _responseModel.modelo, parseDominio, _resultAction.vista_id, _resultAction.pagina, 0, null, _resultAction.sjoin, "",_resultAction.proyection_sjoin)
                                      responseAction.data = dataModel.data
                                      one2manyData  = await this.getDataModelCat(_responseModel.id)
                                      many2manyData = await this.many2ManyData(_responseModel.id, resultView.data[0].vista_id, dataToSearch)
                                if (dataToSearch && dataToSearch.id) {
                                  if (_resultAction.dominio_detalle) 
                                      many2oneData = await this.getInDataModelmany2one(_responseModel.id, responseAction.data)
                                  else 
                                      many2oneData = await this.getDataModelmany2one(_responseModel.id, dataToSearch.id, resultGroup)
                              }
                          }else 
                          {
                            if (_resultAction.dominio == 'All') {
                              dataModel           = await super.getDataModel(resultAccess.regla, resultGroup.data[0].grupo_id, _responseModel.modelo, 'empty', _resultAction.vista_id, _resultAction.pagina, 0, null, null, "",'')
                              responseAction.data = dataModel.data
                              many2oneData        = await this.getAllDataModelmany2one(_responseModel.id, responseAction.data)
                            }
                            else { //empty
                              if (resultView.data[0].tipo_vista == 'Graph') 
                                console.log("TIPO VISTa", resultView.data[0].tipo_vista)
                              else {
                                dataModel = await super.getDataModel(resultAccess.regla, resultGroup.data[0].grupo_id, _responseModel.modelo, 'empty', _resultAction.vista_id, _resultAction.pagina, 0, null, null, "",'')
                                responseAction.data = dataModel.data
                                one2manyData = await this.getDataModelCat(_responseModel.id)
                                many2manyData = await this.many2ManyData(_responseModel.id, resultView.data[0].vista_id, dataToSearch)
                              }

                            }
                          }
                          const general = await (await this.getGeneral(1)).data.shift()
                          responseAction.childrenList = [...this.childrenListArray]
                          responseAction.childrenList2 = [...this.items]
                          responseAction.id        = _resultAction.id
                          responseAction.mode      = _resultAction.mode
                          responseAction.menu      = [...resultMenu.data]
                          responseAction.model     = _responseModel.modelo
                          responseAction.nameModel = _responseModel.nombre
                          responseAction.display_name = _responseModel.nombre_desplegado
                          responseAction.access    = resultAccess
                          responseAction.model_id  = _responseModel.id
                          responseAction.action.typeAction = _resultAction.tipo_accion
                          responseAction.total_row_model   = await (await this.getCountRowDataModel(_responseModel.modelo)).data[0].total
                          responseAction.action.action     = _resultAction.id
                          responseAction.action.display_name = _resultAction.nombre_desplegado
                          responseAction.action.name      = _resultAction.nombre
                          responseAction.action.viewMode  = _resultAction.vista_modo.split(',')
                          responseAction.action.viewForm  = _resultAction.vista_forma
                          responseAction.action.src_model = _resultAction.origen_modelo
                          responseAction.action.res_model = _resultAction.respuesta_modelo
                          responseAction.action.mode      = _resultAction.modo
                          responseAction.action.domain    = _resultAction.dominio
                          responseAction.currentAction    = _resultAction.id
                          responseAction.paginacion = {
                            pagina         : _resultAction.pagina,
                            opciones_pagina: _resultAction.opciones_pagina,
                            idxPagina      : 0,
                            largo          : dataModel?.totalFilas.data[0].total
                          }
                          responseAction.view      = [...resultView.data]
                          responseAction.fullname  = resultView.data[0].path
                          responseAction.outlet    = resultView.data[0].outlet
                          responseAction.extraData = extraData
                          // responseAction.field=[...resultFieldByModel.data]
                          if (dataModel && dataModel.select)
                            responseAction.field = [...dataModel.select]
                          responseAction.one2manydata  = one2manyData
                          responseAction.many2manydata = many2manyData
                          responseAction.many2onedata  = many2oneData
                          responseAction.pais          = general.pais_id
                          responseAction.idioma        = general.idioma_id
                          responseAction.dataToSearch  = dataToSearch
                          responseAction.parameter     = routerParametros
                          console.log("retorna")
                          return res.status(200).json({ success: true, data: responseAction, errors: null })
                        }
                   } else  return res.status(200).json({ success: false, data: null, errors: [{ message: "error no tiene permisosos de acceso al modelo" }] })
                }else return res.status(200).json({ success: false, data: null, errors: [{ message: "error verifique la parametrizacion de grupos por vista" }] })
            }else return res.status(200).json({ success: false, data: null, errors: [{ message: "error verifique la parametrizacion de grupos por accion forma" }] })
          }else return res.status(200).json({ success: false, data: null, errors: [{ message: "error verifique la parametrizacion de grupos por usuario" }] })
        }else  return res.status(200).json({ success: false, data: null, errors: [{ message: "error en el grupo asociado al usuario" }] })
      }else return res.status(200).json({ success: false, data: null, errors: [{ message: "error no existe un grupo asociado al usuario" }] })

  }





  async confirmation(req, res) {
    let confirmToken = new tokenController()
    confirmToken.returnToken(req.params.token).then(async result => {
      if (result) {
        try {
          let _result = await super._findOneAnyModel('bnc_mail', { raw: true, where: { active: true } })
          if (_result.success && _result.data.user_uid > 1) {
            try {
              await super._updateAnyModel('sys_user',
                {
                  where:
                  {
                    id: _result['user_uid']
                  }
                },
                {
                  active: true,
                  status: 'offline'
                },
              )
              try {
                await super._updateAnyModel('bnc_mail',
                  {
                    where:
                    {
                      user_uid: _result['user_uid']
                    }
                  },
                  {
                    active: false,
                  },
                )
                res.redirect('http://localhost:4500/sign-in')
              } catch (error) {
                await super._createDataAnyModel(res, 'bnc_mail_error', { description: error, token: req.params.token })
              }
            } catch (error) {
              await super._createDataAnyModel(res, 'bnc_mail_error', { description: error, token: req.params.token })
            }
          }
          else {

            await super._createDataAnyModel(res, 'bnc_mail_error', { description: 'not return result of bnc_mail model, already activate or not exist, Controller: confirmation line 56', token: req.params.token })
            res.status(400).send({ success: false })
          }
        } catch (error) {
          super._createDataAnyModel(res, 'bnc_mail_error', { description: error, token: req.params.token })
        }
      } else {
        super._createDataAnyModel(res, 'bnc_mail_error', { description: 'not return result, return confirmToken.returnToken', token: req.params.token })
      }
    }).catch(error => {
      super._createDataAnyModel(res, 'bnc_mail_error', { description: error, token: req.params.token })
    })
  }

}