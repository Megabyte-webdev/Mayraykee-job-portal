import { useEffect, useState } from "react";
import { onSuccess } from "../../../utils/notifications/OnSuccess";
import { onFailure } from "../../../utils/notifications/OnFailure";
import { axiosClient } from "../../../services/axios-client";
import { FaSpinner } from "react-icons/fa";
import UseAdminManagement from "../../../hooks/useAdminManagement";

const Support = () => {
    const client = axiosClient();
    const { getSupport, loading } = UseAdminManagement();
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reply, setReply] = useState({ id: null, text: "" });
    useEffect(() => {
        const fetchSupport = async () => {
            try {
                const res = await getSupport();
                setMessages(res)
            } catch (err) {
                onFailure({ message: "Error Occurred", error: err?.message || "An error occurred while fetching" })
            };
        }
        console.log(loading)
        fetchSupport()
    }, []);

    const openReplyModal = (msg) => {
        setSelectedMessage(msg);
        setReply({ id: msg.id, text: msg?.reply || "" });
    };

    const handleReplyChange = (e) => {
        setReply((prev) => ({ ...prev, text: e.target.value }));
    };

    const handleReplySubmit = () => {
        if (!reply.text.trim()) {
            onFailure({ message: "Error Occurred", error: "Enter a suitable reply" });
            return
        };
        setIsLoading(true);
        client.put(`/contact/${reply?.id}/reply`, { reply: reply.text })
            .then(() => {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg?.id === reply.id ? { ...msg, status: "Resolved", reply: reply.text } : msg
                    )
                );
                setReply({ id: null, text: "" });
                setSelectedMessage(null);
                onSuccess({ message: "Success", success: "Reply sent successfully" });
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false)
                onFailure({ message: "Error Occurred", error: err?.message || "Failed to send reply" });
            });
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Feedback & Support </h2>
            <div className="w-full overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <FaSpinner className="animate-spin text-3xl" />Loading...
                    </div>
                )
                    :
                    <table className="w-full min-w-[500px] border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border">User</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Message</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))?.map((msg) => (
                                <tr key={msg?.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 border">{msg?.name}</td>
                                    <td className="p-3 border max-w-xs truncate">
                                        <span
                                        >
                                            {msg?.email}
                                        </span>
                                    </td>
                                    <td className="p-3 border max-w-xs truncate">
                                        <span
                                        // onClick={() => openReplyModal(msg)}
                                        >
                                            {/* View Message */} {msg?.message?.length > 15 ? `${msg?.message?.slice(0, 15)}...` : msg?.message}
                                        </span>
                                    </td>

                                    <td className="p-3 border">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm font-medium ${msg?.status === "Resolved" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"
                                                }`}
                                        >
                                            {msg?.status || "Pending"}
                                        </span>
                                    </td>
                                    <td className="p-3 border">
                                        {(
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-700 transition"
                                                onClick={() => openReplyModal(msg)}
                                            >
                                                {msg.status === "Resolved" ? "View" : "Reply"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>

            {/* Modal for Replying */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
                        {/* Close Icon */}
                        <button
                            className="absolute top-3 right-3 text-red-600 hover:text-red-900 font-bold"
                            onClick={() => setSelectedMessage(null)}
                        >
                            ✕
                        </button>

                        <h3 className="text-lg font-semibold mb-2">
                            Message from {selectedMessage?.name || selectedMessage?.email}
                        </h3>
                        <p className="mb-4 p-2 text-gray-700 bg-gray-100 rounded font-medium">{selectedMessage.message}</p>
                        <textarea
                            required
                            className="w-full border p-2 rounded-lg focus:ring focus:ring-green-300"
                            rows="4"
                            placeholder="Enter reply..."
                            value={reply.text}
                            disabled={selectedMessage?.status === "Resolved"}
                            onChange={handleReplyChange}
                        ></textarea>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                                onClick={() => setSelectedMessage(null)}
                            >
                                Cancel
                            </button>

                            {/* Mailto Button */}
                            {selectedMessage?.status !== "Resolved" && <button
                                disabled={isLoading || selectedMessage?.status === "Resolved"}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                                //href={`mailto:${selectedMessage?.email}?subject=Reply to your message&body=${encodeURIComponent(reply.text)}`}
                                onClick={handleReplySubmit}
                            >
                                Reply {isLoading && <FaSpinner className="animate-spin" />}
                            </button>}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Support;
