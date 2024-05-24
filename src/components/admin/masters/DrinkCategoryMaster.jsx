import DataTable from "components/admin/masters/DataTable";

const DrinkCategoryMaster = () => {

  const fields = [
    { name: 'id', title: 'id', dataType: 'number', readOnly: true, displayIn: ['table'], sortable: true, nullable: true },
    { name: 'name_en', title: 'Name (en)', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true, nullable: false },
    { name: 'name_hu', title: 'Name (hu)', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true, nullable: false },
    { name: 'parent_id', title: 'Parent Category', dataType: 'master', dataModel: 'categories', readOnly: false, displayIn: ['table', 'form'], sortable: true, nullable: true },
  ];

  const masters = {
    'categories': { url: 'categories/parents', key: 'id', value: 'name', nullable: true, nullText: "No Parent" }
  }

  const model = {
    name: 'Drink Category',
    namePlural: 'Drink Categories',
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
      url="categories"
      model={model}
      fields={fields}
      masters={masters}
      validateInsert={validateInsert}
      validateUpdate={validateUpdate}
    />
  )
}


export default DrinkCategoryMaster;