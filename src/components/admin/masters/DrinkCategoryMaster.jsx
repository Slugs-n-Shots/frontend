import DataTable from "components/admin/masters/DataTable.jsx";

const DrinkCategoryMaster = () => {

  const fields = [
    { name: 'id', title: 'id', dataType: 'number', readOnly: true, displayIn: ['table'], sortable: true },
    { name: 'name_en', title: 'Name (en)', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'name_hu', title: 'Name (hu)', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'description_en', title: 'Description (en)', dataType: 'longstring', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'description_hu', title: 'Description (hu)', dataType: 'longstring', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'category_id', title: 'Category', dataType: 'master', dataModel: 'categories', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'active', title: 'Active', dataType: 'boolean', values: ['No', 'Yes'], readOnly: false, displayIn: ['table', 'form'], sortable: true },
  ];

  const masters = {
    'categories': { url: 'categories', key: 'id', value: 'name' }
  }

  const model = {
    name: 'Drink',
    namePlural: 'Drinks',
  }

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
      validateInsert={validateInsert}
      validateUpdate={validateUpdate}
    />
  )
}


export default DrinkCategoryMaster;