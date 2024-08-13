import { supabase } from "../config/supabaseClient";
import { useAuth } from "../hooks/AuthProvider";
import { Button } from "@nextui-org/button";
import {
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

export default function AvatarModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [image, setImage] = useState<File>();

  const { user } = useAuth();

  const handleChangeAvatar = async () => {
    if (!image) {
      return;
    }
    const uploadAvatar = async () => {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload("public/avatar1.png", image, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        console.log(error);
      }
      if (data) {
        const avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatar1.png`;
        const { data, error } = await supabase
          .from("users")
          .update({ avatar_url })
          .eq("id", user?.id);
        if (error) {
          console.log(error);
        }
      }
    };

    uploadAvatar();
    onOpenChange();
    window.location.reload();
  };

  return (
    <>
      <Button
        variant="light"
        color="primary"
        onPress={onOpen}
        fullWidth
        className="mt-3"
      >
        Change profile picture
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="z-50 w-lg h-lg px-7"
      >
        <ModalContent>
          <ModalHeader>Change profile picture</ModalHeader>
          <div className="flex justify-center items-center flex-col gap-3">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="avatar"
                className=" rounded-full w-56 h-56 bg-cover center"
              />
            ) : (
              <img
                src={user?.user_metadata.avatar_url}
                alt="avatar"
                className=" rounded-full w-56 h-56 bg-cover center"
              />
            )}

            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="multiple_files"
            >
              Upload multiple files
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="multiple_files"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImage(event.target.files ? event.target.files[0] : undefined)
              }
            />
          </div>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onOpenChange}>
              Cancle
            </Button>
            <Button color="primary" onPress={handleChangeAvatar}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
