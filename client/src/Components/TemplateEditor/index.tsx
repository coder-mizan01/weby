import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Monitor, Smartphone, X } from "lucide-react";
import { api } from "../../App/apiService";
import { useParams } from "react-router-dom";
import TemplateOne from "../../UI_Collection/TemplateOne";
import TemplateTwo from "../../UI_Collection/TemplateTwo";
import { Rnd } from "react-rnd";


interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TemplateEditor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header Navigation */}
      <div className="flex items-center justify-between bg-white shadow-md py-3 px-2 border-b">
        <div>
          <Link
            to={`/`}
            target="_blank"
            className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Wayvi
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Monitor className="text-gray-600 w-6 h-6" />
          <Smartphone className="text-gray-600 w-6 h-6" />
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-[#9F42BD] font-semibold cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Edit Site
          </button>
          <Link
            to={`/`}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-[0.9rem] rounded-md hover:bg-gray-200 transition-colors"
          >
            Preview
          </Link>
          <Link
            to={`/`}
            className="px-3 py-1 bg-blue-500 text-white text-[0.9rem] rounded-md hover:bg-blue-600 transition-colors"
          >
            Publish
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow">
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
    </div>
  );
};


export const Modal: React.FC<ModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [websiteName, setWebsiteName] = useState("");
  const [professionalTitle, setProfessionalTitle] = useState("");
  const [documentId, setDocumentId] = useState("");

  const { templateId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrCreateWebsiteData = async () => {
      try {
        const response = await api.post("/website/post", { templateId });
        const data = response.data.payload;

        if (data) {
          setWebsiteName(data.websiteName);
          setProfessionalTitle(data.professionalTitle);
          setDocumentId(data._id);
        }
      } catch (error) {
        console.error("Error fetching website name:", error);
        alert("Error in creating website");
      }
    };

    fetchOrCreateWebsiteData();
  }, [templateId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) {
      alert("No website to update!");
      return;
    }
    try {
      const response = await api.put(`/website/update/${documentId}`, {
        websiteName,
        professionalTitle,
        templateId,
      });
      if (response.status === 200) {
        console.log("Website updating successful");
        setIsModalOpen(false); // Close the modal after successful update
      }
    } catch (error) {
      console.error("Error updating website name:", error);
      alert("Failed to update website data. Please try again.");
    }
  };

  return (
    <>
   {templateId === "p1" && <TemplateOne 
    websiteName={websiteName} 
    professionalTitle={professionalTitle} 
/>}
{templateId === "p2" && <TemplateTwo 
    websiteName={websiteName} 
    professionalTitle={professionalTitle} 
/>}

      {isModalOpen && (
        <Rnd
          default={{
            x: window.innerWidth / 2 - 200, // Center horizontally
            y: window.innerHeight / 2 - 200, // Center vertically
            width: 400,
            height: "auto",
          }}
          bounds="window" // Restrict movement to the viewport
          enableResizing={false} // Disable resizing if not needed
          dragHandleClassName="drag-handle" // Use a specific class as drag handle
        >
          <div className="bg-white rounded-lg shadow-xl p-6 relative box-border">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4 drag-handle cursor-move">
              <h2 className="text-xl font-bold">Edit Site</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="websiteName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Update Website Name
                </label>
                <input
                  id="websiteName"
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder={websiteName || "Enter new website name"}
                />
              </div>

              <div>
                <label
                  htmlFor="professionalTitle"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Update Professional Title
                </label>
                <input
                  id="professionalTitle"
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Enter professional title"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 py-2 px-4 rounded-md hover:bg-yellow-500 transition"
                disabled={!documentId}
              >
                Update Data
              </button>
            </form>
          </div>
        </Rnd>
      )}
    </>
  );
};


export default TemplateEditor;