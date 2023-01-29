import axios from "axios";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { AddEmployeeModal } from "../components";
import { Context } from "../Helper/Context";
import useToggle from "../Hooks/useToggle";

const Employee = () => {
  const { token } = useContext(Context);
  const [isOpen, toggle] = useToggle(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    telephone: "",
    address: "",
    email: "",
    dateOfEmployment: "",
    username: "",
    password: "",
    dateOfCancellation: "",
  });

  const clearInputField = () => {
    setEmployeeData({
      id: "",
      firstName: "",
      lastName: "",
      telephone: "",
      address: "",
      email: "",
      dateOfEmployment: "",
      username: "",
      password: "",
      dateOfCancellation: "",
    });
  };

  const handleAddEmployee = () => {
    axios
      .post(`http://localhost:5000/api/employee/add`, employeeData)
      .then(() => {
        setEmployees([...employees, employeeData]);
        clearInputField();
      });
  };

  const getEmployees = async () => {
    await axios
      .get(`http://localhost:5000/api/employee/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setEmployees(response.data))
      .catch((err) => err);
  };

  const updateEmployeeData = (id) => {
    let employee = employees.find((employee) => employee._id === id);
    setEmployeeData({
      ...employee,
      dateOfEmployment: employee?.dateOfEmployment?.slice(0, 10),
      dateOfCancellation: employee?.dateOfCancellation?.slice(0, 10),
    });
  };

  const updateEmployee = () => {
    axios
      .patch(`http://localhost:5000/api/employee/update`, employeeData)
      .then((response) => response.data)
      .catch((err) => err);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div className="bg-violet-100 h-screen absolute w-full">
      {isOpen && (
        <AddEmployeeModal
          toggle={toggle}
          setEmployeeData={setEmployeeData}
          handleAddEmployee={handleAddEmployee}
          employeeData={employeeData}
          clearInputField={clearInputField}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          updateEmployee={updateEmployee}
        />
      )}

      <div className="mt-32 max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center my-8"></div>
        <button
          onClick={toggle}
          className="px-5 py-3 bg-violet-900  hover:bg-violet-500 hover:text-white text-white text-xl rounded-3xl mb-10"
        >
          Dodaj Zaposlenika
        </button>
        <div className="relative overflow-x-auto ">
          <table className="w-full text-sm text-left text-gray-500 rounded-3xl">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
              <tr className="bg-violet-900 text-white">
                <th scope="col" className="pl-6 pr-4 py-3">
                  Ime
                </th>
                <th scope="col" className="px-4 py-3">
                  Prezime
                </th>
                <th scope="col" className="px-4 py-3">
                  Broj Telefona
                </th>
                <th scope="col" className="px-4 py-3">
                  Adresa
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Datum Zaposlenja
                </th>
                <th scope="col" className="px-4 py-3">
                  Datum otkaza
                </th>
                <th scope="col" className="px-4 py-3">
                  Azuriraj
                </th>
              </tr>
            </thead>
            {employees.length > 0 && (
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee?._id} class="border-b text-black text-base">
                    <td className="pl-6 pr-4 py-4">{employee?.firstName}</td>
                    <td className="p-4">{employee?.lastName}</td>
                    <td className="p-4">{employee?.telephone}</td>
                    <td className="p-4">{employee?.address}</td>
                    <td className="p-4">{employee?.email}</td>
                    <td className="p-4">
                      {employee?.dateOfEmployment?.slice(0, 10)}
                    </td>
                    <td className="p-4">
                      {employee?.dateOfCancellation?.slice(0, 10) || ""}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          toggle();
                          setIsUpdate(true);
                          updateEmployeeData(employee?._id);
                        }}
                        className="bg-violet-900 px-5 py-2 rounded-3xl text-white text-base  hover:bg-violet-500"
                      >
                        Azuriraj
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employee;
