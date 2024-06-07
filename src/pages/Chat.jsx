import PocketBase from "pocketbase";
import { useEffect, useState, useMemo } from "react";

const Chat = () => {
  const [zander, setZander] = useState({
    messages: [],
  });
  const [jeffrey, setJeffrey] = useState({
    messages: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  if (!localStorage.getItem("token")) {
    window.location.href = "/";
  }

  const pbUrl = import.meta.env.VITE_POCKETBASE_URL;
  const pb = useMemo(() => {
    new PocketBase(pbUrl);
  }, [pbUrl]);

  useEffect(() => {
    pb.collection("users").subscribe(
      import.meta.env.VITE_JEFFREY_ID,
      function (e) {
        setJeffrey(e.record);

        if (pb.authStore.model.id !== import.meta.env.VITE_JEFFREY_ID) {
          if (Notification.permission === "granted") {
            new Notification(
              e.record.messages[e.record.messages.length - 1][0],
              {
                body: "said jeffrey",
              }
            );
          }
        }
      }
    );
    pb.collection("users").subscribe(
      import.meta.env.VITE_ZANDER_ID,
      function (e) {
        setZander(e.record);

        if (pb.authStore.model.id !== import.meta.env.VITE_ZANDER_ID) {
          if (Notification.permission === "granted") {
            new Notification(
              e.record.messages[e.record.messages.length - 1][0],
              {
                body: "said zander",
              }
            );
          }
        }
      }
    );
  }, [setZander, setJeffrey, pb]);

  useEffect(() => {
    const getZander = async () => {
      try {
        const zander = await pb
          .collection("users")
          .getOne(import.meta.env.VITE_ZANDER_ID);
        setZander(zander);
      } catch (error) {
        console.error(error);
      }
    };

    const getJeffrey = async () => {
      try {
        const jeffrey = await pb
          .collection("users")
          .getOne(import.meta.env.VITE_JEFFREY_ID);
        setJeffrey(jeffrey);
      } catch (error) {
        console.error(error);
      }
    };

    getZander();
    getJeffrey();
  }, [setZander, setJeffrey, pb]);

  const onsend = async (e) => {
    e.preventDefault();
    setLoading("wait boy...");

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Thank you for enabling notifications!");
        }
      });
    }

    try {
      let person;
      if (pb.authStore.model.id == import.meta.env.VITE_ZANDER_ID) {
        person = zander;
      } else {
        person = jeffrey;
      }

      await pb.collection("users").update(pb.authStore.model.id, {
        messages: [...person.messages, [message, new Date()]],
      });

      setMessage("");
      setLoading("");
    } catch (e) {
      console.error(e);
      setLoading("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex h-2/3">
        <div className="w-1/2 border border-black overflow-y-scroll">
          <p className="w-1/2">zander&apos;s messages</p>
          {zander.messages.length == 0 ? (
            <p>wait boy...</p>
          ) : (
            zander.messages.map((msg, index) => {
              return (
                <div key={index}>
                  <p>
                    {new Date(msg[1]).toLocaleString()} - {msg[0]}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <div className="w-1/2 border border-black overflow-y-scroll">
          <p className="w-1/2">jeffrey&apos;s messages</p>
          {jeffrey.messages.length == 0 ? (
            <p>wait boy...</p>
          ) : (
            jeffrey.messages.map((msg, index) => {
              return (
                <div key={index}>
                  <p>
                    {new Date(msg[1]).toLocaleString()} - {msg[0]}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="flex flex-col h-1/3">
        <p className="flex justify-between">
          <span>
            {pb.authStore.model.id == import.meta.env.VITE_ZANDER_ID
              ? "you are zander"
              : "you are jeffrey"}
          </span>
          <span>{loading}</span>
        </p>
        <form className="w-full h-full flex flex-col" onSubmit={onsend}>
          <input
            type="text"
            placeholder="type smth here"
            className="w-full h-full"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div>
            <button type="button" className="fixed bottom-0 left-0">
              update
            </button>
            <button type="submit" className="w-full">
              send
            </button>
            <button
              className="fixed bottom-0 right-0"
              onClick={() => {
                pb.authStore.clear();
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              quit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
