import DataTable from "components/admin/masters/DataTable.jsx";

const GuestMaster = () => {

  const fields = [
    { name: 'id', title: 'id', dataType: 'number', readOnly: true, displayIn: ['table'], sortable: true },
    { name: 'first_name', title: 'First Name', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'middle_name', title: 'Middle Name', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'last_name', title: 'Last Name', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'email', title: 'Email', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'picture', title: 'Profile picture', dataType: 'image', readOnly: true, displayIn: ['form'], sortable: false },
    { name: 'active', title: 'Active', dataType: 'boolean', values: ['No', 'Yes'], readOnly: false, displayIn: ['table', 'form'], sortable: true },

  ];

  const masters = {
  }

  const model = {
    name: 'Guest',
    namePlural: 'Guests',
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
      url="guests"
      model={model}
      fields={fields}
      masters={masters}
      validateInsert={validateInsert}
      validateUpdate={validateUpdate}
    />
  )
}


export default GuestMaster;