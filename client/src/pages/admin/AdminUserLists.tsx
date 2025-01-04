import { Link } from "react-router-dom";
import Button from "../../components/Button";
import DropDownBox from "../../components/DropDownBox";
import SearchBox from "../../components/SearchBox";
import Table from "./components/Table/Table";
import TableData from "./components/Table/TableData";

const AdminUserLists: React.FC = () => {
  return (
    <div className="m-auto w-full max-w-[1000px]">
      <div className="m-2">
        <div className="flex items-center gap-2 actions mt-5">
          <SearchBox />

          <DropDownBox className="max-w-28">
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="reported">Reported</option>
          </DropDownBox>
        </div>

        <div className="mt-3" id="users-list">
          <Table
            headings={[
              "User ID",
              "Username",
              "Full Name",
              "Email",
              "Mobile",
              "Status",
              "Action",
            ]}
          >
            <tr>
              <TableData>23415</TableData>
              <TableData>new_user</TableData>
              <TableData>New User</TableData>
              <TableData>newuser@email.com</TableData>
              <TableData>9876858963</TableData>
              <TableData>Active</TableData>
              <TableData className="!px-1">
                <div className="flex gap-1">
                  <Link to={"edit/"} className="text-xs w-full">
                    <Button className="w-full">Edit</Button>
                  </Link>
                  <Button className="text-xs w-full" backgroundColor="#991b1b">
                    Block
                  </Button>
                </div>
              </TableData>
            </tr>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserLists;
