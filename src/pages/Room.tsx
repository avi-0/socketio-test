import { useParams, useSearchParams } from "react-router-dom";
import JoinRoom from "./JoinRoom";
import { useOnSocketEvent } from "../hooks/useOnSocketEvent";
import { useSocket } from "../hooks/useSocket";
import { Provider } from 'react-redux';
import store from "../store";
import Game from "../components/Game";

export default function Room() {
    const [searchParams, _] = useSearchParams();
    const params = useParams();

    const username = searchParams.get("name");

    if (username == null) {
        return <JoinRoom id={params.id || ""} />
    }

    const roomId = params.id;

    const socket = useSocket();

    useOnSocketEvent(socket, "connect", () => {
        socket.emit("join-room", roomId, username);
    });

    return <Provider store={store}>
        <Game socket={socket}/>
    </Provider>
}
