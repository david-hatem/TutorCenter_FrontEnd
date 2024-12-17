import axios from "axios";
import { Bounce, toast } from "react-toastify";

const API_BASE_URL = "https://deltapi.website:444";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const groupsApi = {
  getAll: () => api.get("/groups/"),
  create: (data: any) => api.post("/groups/", data),
  update: (id: number, data: any) => api.put(`/groups/${id}`, data),
  delete: (id: number) => api.delete(`/groups/${id}`),
};

export const levelsApi = {
  getAll: () => api.get("/levels/"),
};

export const branchesApi = {
  getAll: () => api.get("/branches/"),
};

export const subjectsApi = {
  getAll: () => api.get("/subjects/"),
};

export const teachersApi = {
  getAll: () => api.get("/teachers/"),
};

// export const fetchMonthFinance = async () => {
//   try {
//     const response = await axios.get(
//       "https://167.114.0.177:444/dashboard/financial-metrics/"
//     );
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.error("Unexpected response:", response);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching prof list:", error);
//     return [];
//   }
// };

// export const fetchWeekFinance = async () => {
//   try {
//     const response = await axios.get(
//       "https://167.114.0.177:444/dashboard/weekly-financial-metrics/"
//     );
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       console.error("Unexpected response:", response);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching prof list:", error);
//     return [];
//   }
// };

export const fetchGroupeList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/groupe_list/`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching groupe list:", error);
    return [];
  }
};

export const fetchFiliereList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/filiere_list/`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching groupe list:", error);
    return [];
  }
};

export const fetchNiveauList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/niveau_list/`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching niveau list:", error);
    return [];
  }
};

export const fetchMatiereList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/matiere_list/`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching matiere list:", error);
    return [];
  }
};

export const fetchTeachersList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/professeur_list/`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching prof list:", error);
    return [];
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/groupes/create/`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      console.log("Group created successfully:", response.data);
      toast.success("Group created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      toast.error("Faild create group", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateGroup = async (groupData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/groupes/update/${id}`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      console.log("Group Updated successfully:", response.data);
      toast.success("Group updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      toast.error("Failed update group", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const createStudent = async (groupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/etudiants/create/`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      console.log("Etudiants created successfully:", response.data);
      toast.success("Etudiants created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      toast.error("Failed create etudiants", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateStudent = async (groupData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/etudiants/update/${id}`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("Etudiants updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Etudiants created successfully:", response.data);
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      toast.error("Failed update etudiants", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const addStudentGrp = async (groupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/etudiants/add-to-group/`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Etudiants created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    toast.error("Failed", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    console.error("Error creating group:", error);
    return null;
  }
};

export const createTeacher = async (groupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/professeurs/create/`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Professeurs created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Professeurs created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create professeurs", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateTeacher = async (groupData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/professeurs/update/${id}`, groupData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("Professeurs updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Professeurs created successfully:", response.data);
      toast.error("Failed update Professeurs", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const createPayment = async (payData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/create/`, payData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Payment created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Payment created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create payment", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updatePayment = async (payData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/payments/${id}/update/`, payData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("Payment updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Payment created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed update payment", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const createLevel = async (levData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/niveaux/create/`, levData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Level created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Level created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create level", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};
export const updateLevel = async (levData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/niveaux/update/${id}`, levData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("Level updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      toast.error("Failed update level", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const createBranch = async (branchData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/filieres/create/`, branchData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Branch created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Branch created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create branch", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateBranch = async (branchData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/filieres/update/${id}`, branchData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("Branch updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Branch created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed update branch", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const createSub = async (subData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/matieres/create/`, subData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Subject created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Subject created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create subject", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateSub = async (subData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/matieres/update/${id}`, subData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("Subject updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Subject created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed update subject", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const createDepenses = async (subData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/depenses/`, subData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("Depenses created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Subject created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create Depenses", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateDepenses = async (subData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/depenses/${id}`, subData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("depenses updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      toast.error("depenses update subject", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const createSortiesBanque = async (subData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sorties-banque/`, subData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 201) {
      toast.success("SortiesBanque created successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.log("Subject created successfully:", response.data);
      return response.data;
    } else {
      toast.error("Failed create SortiesBanque", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export const updateSortiesBanque = async (subData, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/sorties-banque/${id}`, subData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.statusText === "OK") {
      toast.success("SortiesBanque updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return response.data;
    } else {
      toast.error("Failed update SortiesBanque", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      console.error("Unexpected response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating group:", error);
    return null;
  }
};

export default createGroup;
