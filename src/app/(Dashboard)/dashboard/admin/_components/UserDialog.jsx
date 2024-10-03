"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Select,
} from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";
import { BiChevronDown, BiLoader, BiTrash, BiUpload } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

import { createUser, deleteUser, updateUser } from "@/lib/actions";

export const UserDialog = ({ dialogData, dialogOpen, onClose, loadUsers }) => {
  const [user, setUser] = useState(dialogData || getDefaultUser());
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(["customer", "admin", "skillmaster", "dev"]);

  function getDefaultUser() {
    return {
      email: "",
      first_name: "",
      last_name: "",
      role: "customer",
      encrypted_data: null,
      encrypted_symmetric_key: null,
      preferred_skill_master_ids: [],
      otp_secret: null,
      consumed_timestep: null,
      otp_required_for_login: null,
      platforms: [],
      image_url: null,
    };
  }

  useEffect(() => {
    if (dialogData) {
      setUser(dialogData);
    } else {
      setUser(getDefaultUser());
    }
  }, [dialogData]);

  // Function to check if the user data is unchanged
  const isDataUnchanged = () => {
    return (
      user.email === dialogData?.name &&
      user.first_name === dialogData?.first_name &&
      user.last_name === dialogData?.last_name &&
      user.role === dialogData?.role &&
      user.encrypted_data === dialogData?.encrypted_data &&
      user.encrypted_symmetric_key === dialogData?.encrypted_symmetric_key &&
      user.preferred_skill_master_ids ===
        dialogData?.preferred_skill_master_ids &&
      user.otp_secret === dialogData?.otp_secret &&
      user.consumed_timestep === dialogData?.consumed_timestep &&
      user.otp_required_for_login === dialogData?.otp_required_for_login &&
      user.platforms === dialogData?.platforms &&
      user.image_url === dialogData?.image_url
    );
  };

  const handleSubmit = async (userData) => {
    if (userData.id && isDataUnchanged()) {
      toast.error("No changes were made.");
      return;
    }

    setLoading(true);
    try {
      if (userData.id) {
        // Update existing user
        const response = await updateUser(userData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("User updated successfully!");
        }
      } else {
        // Add new user
        const response = await createUser(userData);

        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("User added successfully!");
        }
      }

      handleClosed();
    } catch (error) {
      console.log("Error submitting user:", error.message);
      toast.error(error.message);
    } finally {
      loadUsers();
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!userId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await deleteUser(userId);

      if (response.error) {
        // toast.error(response.error);
        toast.error("Error deleting user!");
      } else {
        toast.success("User deleted successfully!");
        handleClosed();
      }
    } catch (error) {
      console.log("Error deleting user:", error.message);
      toast.error(error.message);
    } finally {
      loadUsers();
      setLoading(false);
    }
  };

  const handleClosed = () => {
    onClose();
    setUser(dialogData || getDefaultUser());
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      as="div"
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-lg bg-Plum/50 backdrop-blur-lg p-6 space-y-4 relative">
          <button
            onClick={handleClosed}
            className="rounded-lg hover:bg-white/10 absolute right-0 top-0 m-4"
          >
            <IoClose className="h-8 w-8" />
          </button>

          <DialogTitle className="text-lg font-semibold">
            {dialogData ? "Update User" : "Add New User"}
          </DialogTitle>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] no-scrollbar">
            {/* id */}
            {user.id && (
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(user.id);

                  toast.success("Copied to clipboard!");
                }}
                className="flex gap-2 items-center rounded-lg bg-black/30 px-2 py-1 hover:bg-black/40 w-fit"
              >
                <span className="text-sm font-semibold break-all">
                  ID: {user.id}
                </span>
                <IoCopy className="h-8 w-8 ml-2 p-2 hover:bg-white/10 rounded-lg" />
              </button>
            )}

            {/* Role */}
            <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">Role</Label>

                <div className="relative">
                  <Select
                    value={user?.role}
                    onChange={(e) => {
                      setUser({ ...user, role: e.target.value });
                    }}
                    className="block w-full appearance-none rounded-lg bg-black/20 hover:bg-black/30 py-1.5 px-3"
                  >
                    <option
                      value={null}
                      className="bg-neutral-800"
                      unselectable="on"
                    >
                      Select a role
                    </option>

                    {role.map((item, index) => (
                      <option
                        key={index}
                        value={item}
                        className="bg-neutral-800"
                      >
                        {item}
                      </option>
                    ))}
                  </Select>

                  <BiChevronDown
                    className="group absolute top-1.5 right-4 size-6 fill-white/60"
                    aria-hidden="true"
                  />
                </div>
              </Field>
            </div>

            {/* email */}
            <Field className="flex flex-col gap-1 w-full">
              <Label className="text-sm">Email</Label>
              <Input
                type="email"
                placeholder="john@doe.com"
                autoFocus
                className="input-field"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Field>

            {/* name */}
            <div className="flex flex-wrap gap-4 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">First name</Label>
                <Input
                  type="text"
                  placeholder="First name"
                  autoFocus
                  className="input-field"
                  value={user.first_name}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
              </Field>

              <Field className="flex flex-col gap-1 flex-1">
                <Label className="text-sm">Last name</Label>
                <Input
                  type="text"
                  placeholder="Last name"
                  autoFocus
                  className="input-field"
                  value={user.last_name}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
              </Field>
            </div>

            {/* user image */}
            <Field className="flex flex-col gap-1 w-full bg-white/10 p-4 rounded-lg border border-white/10 hover:border-white/20">
              <Label className="text-sm">Image</Label>
              {user.image ? (
                <div className="group relative cursor-pointer rounded-lg w-fit mx-auto">
                  <Image
                    src={user.image}
                    alt="User Image"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg object-cover bg-white/10"
                  />
                  <IoMdClose
                    type="button"
                    className="h-8 w-8 group-hover:opacity-100 opacity-0 absolute top-0 right-0 p-2 m-2 hover:bg-black rounded-lg border border-white/10 bg-black/80"
                    onClick={() =>
                      setUser({ ...user, image: null, remove_image: "true" })
                    }
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 justify-center w-full">
                  <label
                    for="dropzone-file"
                    className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/10 border-gray-600 hover:border-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <BiUpload className="h-8 w-8 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Click or drag and drop your image here
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="image/*"
                      className="absolute border h-full w-full opacity-0"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setUser({
                              ...user,
                              image: reader.result,
                              remove_image: "false",
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </Field>

            {/* platforms */}

            {/* delete & submit button */}
            <div className="flex items-center justify-between gap-4">
              {/* Delete Button */}
              {dialogData && (
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={loading}
                  className="p-2 rounded-lg hover:bg-white/10 disabled:bg-gray-500/20"
                >
                  {loading ? (
                    <BiLoader className="h-5 w-5 animate-spin" />
                  ) : (
                    <BiTrash className="h-5 w-5 text-red-600" />
                  )}
                </button>
              )}

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit(user)}
                disabled={loading || !user.role || isDataUnchanged()}
                className={clsx(
                  "bg-Gold/80 p-2 rounded-lg hover:bg-Gold/60 disabled:bg-gray-500/20 flex-1",
                  {
                    "cursor-not-allowed":
                      loading || !user.role || isDataUnchanged(),
                  }
                )}
              >
                {loading
                  ? "Submitting..."
                  : dialogData
                  ? "Update user"
                  : "Add user"}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};