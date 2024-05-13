import DataTable from "components/admin/masters/DataTable";

const DrinkMaster = () => {

  const fields = [
    { name: 'id', title: 'id', dataType: 'number', readOnly: true, displayIn: ['table'], sortable: true },
    { name: 'name_en', title: 'Name (en)', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'name_hu', title: 'Name (hu)', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'description_en', title: 'Description (en)', dataType: 'longstring', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'description_hu', title: 'Description (hu)', dataType: 'longstring', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'category_id', title: 'Category', dataType: 'master', dataModel: 'categories', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    // { name: 'units', title: 'Units and Prices', dataType: 'component', component: 'categories', readOnly: false, displayIn: ['form'], sortable: true },
    { name: 'active', title: 'Active', dataType: 'boolean', values: ['No', 'Yes'], readOnly: false, displayIn: ['table', 'form'], sortable: true },
  ];
  const snapInFields = [
    { name: 'id', title: 'id', dataType: 'string', displayIn: ['form'], sortable: false },
    { name: 'drink_id', title: 'drink_id', dataType: 'string', displayIn: ['form'], sortable: false },
    { name: 'quantity', title: 'quantity', dataType: 'string', displayIn: ['form'], sortable: false },
    { name: 'unit_price', title: 'unit_price', dataType: 'string', displayIn: ['form'], sortable: false },
    { name: 'unit', title: 'unit', dataType: 'string', displayIn: ['form'], sortable: false },
    { name: 'unit_code', title: 'unit_code', dataType: 'string', displayIn: ['form'], sortable: false },
  ];

  const masters = {
    'categories': { url: 'categories', key: 'id', value: 'name' }
  }

  const model = {
    name: 'Drink',
    namePlural: 'Drinks',
  }

  const snapIns = [
    { component: 'DrinkUnitsSnapIn', fields: snapInFields }
  ];

  const validateInsert = (object) => {
    // a lenti formában adja vissza a validálási hibákat, sikeres validálás esetén üres objektumot adjon vissza
    // {
    //   'mezőnév1': 'mezőnév1 hibaüzenete',
    //   'mezőnév2': 'mezőnév2 hibaüzenete',
    // }

    return {};
  }

  const validateUpdate = (object) => {
    return {};
  }

  return (
    <DataTable
      url="drinks"
      model={model}
      fields={fields}
      masters={masters}
      snapIns={snapIns}
      validateInsert={validateInsert}
      validateUpdate={validateUpdate}
    />
  )
}


export default DrinkMaster;