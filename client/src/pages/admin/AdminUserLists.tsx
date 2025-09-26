import Button from "../../components/Button";
import DropDownBox from "../../components/DropDownBox";
import SearchBox from "../../components/SearchBox";
import Table from "./components/Table/Table";
import TableData from "./components/Table/TableData";
import { useEffect, useState } from "react";
import type { UserAuthState } from "../../redux/reducers/auth";
import adminApiClient from "../../adminApiClient";
import ConfirmButton from "@/components/ConfirmButton";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminUserLists: React.FC = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("q") || ""
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [users, setUsers] = useState<(UserAuthState & { mobile?: string })[]>(
    []
  );

  useEffect(() => {
    setLoading("Loading...");
    const query = Object.fromEntries(searchParams.entries());
    adminApiClient
      .get("/users", { params: query })
      .then((response) => {
        setUsers(response.data.usersData);
      })
      .catch((error) => {
        toast({
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(null));
  }, [searchParams]);

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

  const handleFilter: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      filter: e.target.value,
    });
  };

  const handleSearch = () => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      q: searchQuery,
    });
  };

  return (
    <div className="m-auto w-full max-w-[1000px]">
      <div className="m-2">
        <div className="flex items-center gap-2 actions mt-5">
          <SearchBox
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearch}
          />

          <DropDownBox
            className="max-w-28"
            onChange={handleFilter}
            value={searchParams.get("filter") || undefined}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </DropDownBox>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[85vh]">
            <span>{loading}</span>
          </div>
        ) : (
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
                        className="w-full"
                        description={`Do you really want to ${
                          user.status === "blocked" ? "unblock" : "block"
                        } ${user.username}`}
                        confirmButtonText={
                          user.status === "blocked" ? "Unblock" : "Block"
                        }
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
        )}
      </div>
    </div>
  );
};

export default AdminUserLists;
