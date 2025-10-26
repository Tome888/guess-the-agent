import toast from "react-hot-toast";

export default async function leaveAgents(
  token: string
) {
  if (!token) return;


  try {
    const res = await fetch("http://localhost:5000/api/leave-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Left room successfully");
      localStorage.removeItem("gameToken");
      localStorage.removeItem("userId");
    } else {
      console.error(data.error || "Failed to leave room");
    }
  } catch (err) {
    console.error(err);
  }
}
