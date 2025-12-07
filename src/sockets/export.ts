import { useLauncherSocket } from ".";

const exchange_code = async (): Promise<string | null> => {
  const socket = useLauncherSocket.getState();
  if (!socket.socket) return "";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      socket.unbind("code", onSocketRequestCode);
      reject(new Error("Timeout"));
    }, 5000);

    const onSocketRequestCode = (data: SocketDownEvent_Code) => {
      console.log("[socket] request_code", data);
      socket.unbind("code", onSocketRequestCode);
      resolve(data.code);
    };
    socket.bind("code", onSocketRequestCode);

    socket.send({
      id: "request_code",
    } as Omit<SocketUpEventDataFromType<"request_code">, "version">);
  }).catch(() => null) as Promise<string | null>;
};

const socketExport = { exchange_code };

export default socketExport;
