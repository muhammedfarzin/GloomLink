import Button from "../../components/Button";
import DropDownBox from "../../components/DropDownBox";
import SearchBox from "../../components/SearchBox";
import Table from "./components/Table/Table";
import TableData from "./components/Table/TableData";
import { useEffect, useState } from "react";
import type { UserAuthState } from "../../redux/reducers/auth";
import adminApiClient from "../../adminApiClient";
import ConfirmButton from "@/components/ConfirmButton";

const AdminUserLists: React.FC = () => {
  const [users, setUsers] = useState<(UserAuthState & { mobile?: string })[]>(
    []
  );

  useEffect(() => {
    adminApiClient.get("/users").then((response) => {
      setUsers(response.data.users);
    });
  }, []);

  const blockUser = (userId: string, type: "block" | "unblock" = "block") => {
    adminApiClient.put(`/users/${userId}/${type}`).then((response) => {
      if (response.status === 200) {
        setUsers(
          users.map((user) => {
            if (user._id === response.data.user._id) {
              user.status = response.data.user.status;
              return user;
            } else return user;
          })
        );
      }
    });
  };

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
              "Username",
              "Full Name",
              "Email",
              "Mobile",
              "Status",
              "Action",
            ]}
          >
            {users.map((user) => (
              <tr key={user._id}>
                <TableData>{user.username}</TableData>
                <TableData>
                  {user.firstname} {user.lastname}
                </TableData>
                <TableData>{user.email}</TableData>
                <TableData>{user.mobile || "Not provided"}</TableData>
                <TableData>{user.status}</TableData>
                <TableData className="!px-1">
                  <div className="flex gap-1">
                    <ConfirmButton
                      description={`Do you really want to ${
                        user.status === "blocked" ? "unblock" : "block"
                      } ${user.username}`}
                      onSuccess={() =>
                        user.status === "blocked"
                          ? blockUser(user._id, "unblock")
                          : blockUser(user._id)
                      }
                    >
                      <Button
                        className="text-xs w-full"
                        backgroundColor={
                          user.status !== "blocked" ? "#991b1b" : undefined
                        }
                      >
                        {user.status === "blocked" ? "Unblock" : "Block"}
                      </Button>
                    </ConfirmButton>
                  </div>
                </TableData>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserLists;
