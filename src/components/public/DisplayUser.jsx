import LineUser from "./LineUser";
import { useNavigate } from "react-router-dom";

export default function DisplayUser(props) {
  const navigate = useNavigate();

  const handleEdit = (userId) => {
    // Navigate to the edit page with the user ID
    navigate(`/edit/${userId}`);
  };

  const handleAdd = (userId) => {
    // Navigate to the edit page with the user ID
    navigate(`/add/${userId}`);
  };

  const handleDelete = (userId) => {
    // Implement your delete logic here
    console.log(`Deleting user with ID ${userId}`);
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((user, index) => (
            <tr key={index}>
              <LineUser value={user.id} />
              <LineUser value={user.name} />
              <LineUser value={user.email} />
              <LineUser value={user.role_code} />
              <LineUser value={user.active} />
              <td>
                <button className="edit" onClick={() => handleEdit(user.id)}>Edit</button>
              </td>
              <td>
                <button className="delet" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      <button className="add" onClick={() => handleAdd()}>Add</button>
    </div>
  );
}
