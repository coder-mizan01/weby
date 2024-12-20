

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../App/apiService";
import TemplateOne from "../../UI_Collection/TemplateOne";
import TemplateTwo from "../../UI_Collection/TemplateTwo";
import { Rnd } from "react-rnd";
import { X } from "lucide-react";


interface ModalProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }

export const Modal: React.FC<ModalProps> = ({ isModalOpen, setIsModalOpen }) => {
    const [websiteName, setWebsiteName] = useState("");
    const [professionalTitle, setProfessionalTitle] = useState("");
    const [menus, setMenus] = useState<string[]>([]);
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
            setMenus(data.menus?.map((menu: any)=> menu.trim()));
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
          menus,
          templateId,
        });
        console.log(response)
        if (response.status === 200) {
          console.log("Website updating successful");
          setIsModalOpen(false); // Close the modal after successful update
        }
      } catch (error) {
        console.error("Error updating website name:", error);
        alert("Failed to update website data. Please try again.");
      }
    };
  
      // New function to update a specific menu
      const handleMenuChange = async (index: number, newValue: string) => {
        const updatedMenus = [...menus];
        updatedMenus[index] = newValue;
        setMenus(updatedMenus);      
        if (documentId) {
          try {
            // Save updated menu to backend
            const response = await api.put(`/website/update/${documentId}`, {
              menus: updatedMenus, // Update only menus
            });
            if (response.status === 200) {
              console.log("Menu updated successfully on the backend.");
            }
          } catch (error) {
            console.error("Failed to update menu on the backend:", error);
            alert("Error updating menu. Please try again.");
          }
        }
      };
      
      
     
    return (
      <>
     {templateId === "p1" && <TemplateOne 
      websiteName={websiteName} 
      professionalTitle={professionalTitle}
      menus={menus}
  />}
  
  {templateId === "p2" && <TemplateTwo 
      websiteName={websiteName} 
      professionalTitle={professionalTitle} 
      menus={menus}
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
  
                <div>
                  <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-2">
                   Edit Menus
                  </label>
                  {menus.map((menu, index)=> (
                    <div key={index} className="mb-2">
                         <input type="text" 
                          value={menu}
                          onChange={(e)=>handleMenuChange(index, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                          placeholder={`Menu ${index + 1}`}
                         />
                    </div>
                  ))}
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