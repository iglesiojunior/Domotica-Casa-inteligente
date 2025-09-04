import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Room() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  };

export default Room;