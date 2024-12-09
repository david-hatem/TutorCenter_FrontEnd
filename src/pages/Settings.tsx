import React, { useEffect, useState } from "react";
// import { useAuth } from "../contexts/AuthContext";
import { Key, Mail, User, UserPlus } from "lucide-react";
import Cookies from "universal-cookie";

interface PasswordChangeForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface NewUserForm {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
}

function Settings() {
  // const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "users">(
    "profile"
  );
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    username: "",
    password: "",
    password2: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const cookies = new Cookies();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    // setMessage("");
    setError("");

    // if (passwordForm?.current_password !== passwordForm?.new_password) {
    //   setError("New password and confirmation do not match.");
    //   return;
    // }

    try {
      const response = await fetch(
        "http://167.114.0.177:81/staff/change-password/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
          body: JSON.stringify({
            old_password: passwordForm?.current_password,
            new_password: passwordForm?.new_password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password.");
      }

      // setMessage("Password changed successfully!");
      // setCurrentPassword("");
      // setNewPassword("");
      // setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    // setMessage('');
    setError("");

    try {
      const response = await fetch("http://167.114.0.177:81/staff/register/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookies.get("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUserForm?.username,
          password: newUserForm?.password,
          password2: newUserForm?.password2,
          email: newUserForm?.email,
          first_name: newUserForm?.first_name,
          last_name: newUserForm?.last_name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register staff.");
      }

      const data = await response.json();
      // setMessage(`Staff registered successfully! ID: ${data.id}`);
      // setUsername('');
      // setPassword('');
      // setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://167.114.0.177:81/staff/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("authToken")}`, // Replace YOUR_ACCESS_TOKEN with the actual token
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching profile: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would make an API call to change the password
      console.log("Changing password:", passwordForm);
      // Reset form after successful change
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  // const handleCreateUser = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     // Here you would make an API call to create a new user
  //     console.log("Creating user:", newUserForm);
  //     // Reset form after successful creation
  //     setNewUserForm({
  //       username: "",
  //       password: "",
  //       password2: "",
  //       email: "",
  //       first_name: "",
  //       last_name: "",
  //     });
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //   }
  // };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "password"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Key className="w-4 h-4 inline-block mr-2" />
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <UserPlus className="w-4 h-4 inline-block mr-2" />
              Create User
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Account Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View your account details.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">
                    {profile?.username}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-md capitalize">
                    {/* {user?.role} */}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Change Password
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account password.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={passwordForm.current_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        current_password: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={passwordForm.new_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        new_password: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={passwordForm.confirm_password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirm_password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}

          {activeTab === "users" && (
            <form onSubmit={handleCreateUser} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Create New User
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add a new user to the system.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newUserForm.username}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newUserForm.email}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newUserForm.first_name}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newUserForm.last_name}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newUserForm.password2}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password2: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
