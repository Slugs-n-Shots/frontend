import DataTable from "components/admin/masters/DataTable";

const EmployeeMaster = () => {

  const fields = [
    { name: 'id', title: 'id', dataType: 'number', readOnly: true, displayIn: ['table'], sortable: true },
    { name: 'first_name', title: 'First Name', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'middle_name', title: 'Middle Name', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'last_name', title: 'Last Name', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'email', title: 'Email', dataType: 'string', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'role_code', title: 'Role', dataType: 'master', dataModel: 'roles', readOnly: false, displayIn: ['table', 'form'], sortable: true },
    { name: 'created_at', title: 'Registration Date', dataType: 'date', readOnly: true, displayIn: ['table'], sortable: true },
    { name: 'active', title: 'Active', dataType: 'boolean', values: ['No', 'Yes'], readOnly: false, displayIn: ['table', 'form'], sortable: true },
  ];

  const masters = {
    'roles': { url: 'employees/roles', key: 'id', value: 'name' }
  }

  const model = {
    name: 'Employee',
    namePlural: 'Employees',
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
      url="employees"
      model={model}
      fields={fields}
      masters={masters}
      validateInsert={validateInsert}
      validateUpdate={validateUpdate}
    />
  )
}


export default EmployeeMaster;