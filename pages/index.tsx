import { useState, useRef } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [prank, setPrank] = useState("prank1");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false); // New state for copied status
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/reserve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, prankId: prank }),
    });

    if (res.ok) {
      const data = await res.json();
      setLink(window.location.origin + data.link);
      setCopied(false); // Reset copied status when new link is generated
    } else {
      alert("Username taken. Try another.");
    }
  };

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true); // Set copied to true
      setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-xl my-4 font-bold">إمزح مع أصدقائك بمقلب فضيحة</h1>

      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="إختر إسما"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <button className="mt-2 bg-green-500 px-4 py-2 rounded text-white" onClick={handleSubmit}>
        إنشاء رابط المقلب
      </button>

      {link && (
        <div className="mt-4 p-4 rounded">
          <p>إضغط لنسخ  هذا الرابط و شاركه مع أصدقائك</p>
          <input
            type="text"
            readOnly
            ref={inputRef}
            value={link}
            className="p-2 w-full text-black bg-gray-200 cursor-pointer"
            onClick={copyToClipboard}
          />
          {copied && <p className="text-green-500 mt-2">📋 تم النسخ بنجاح!</p>} 
        </div>
      )}
    </div>
  );
}
