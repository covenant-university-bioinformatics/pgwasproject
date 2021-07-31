const KEYS = {
  employees: "employees",
  employeeId: "employeeId",
};

export const getDepartmentCollection = () => [
  { id: "1", title: "Development" },
  { id: "2", title: "Marketing" },
  { id: "3", title: "Accounting" },
  { id: "4", title: "HR" },
];

export function insertEmployee(data) {
  let employees = getAllEmployees();
  data["id"] = generateEmployeeId();
  employees.push(data);
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function generateEmployeeId() {
  if (localStorage.getItem(KEYS.employeeId) == null)
    localStorage.setItem(KEYS.employeeId, "0");
  var id = parseInt(localStorage.getItem(KEYS.employeeId));
  localStorage.setItem(KEYS.employeeId, (++id).toString());
  return id;
}

// export function getAllEmployees() {
//   if (localStorage.getItem(KEYS.employees) == null)
//     localStorage.setItem(KEYS.employees, JSON.stringify([]));
//   let employees = JSON.parse(localStorage.getItem(KEYS.employees));
//   //map departmentID to department title
//   let departments = getDepartmentCollection();
//   return employees.map((x) => ({
//     ...x,
//     department: departments[x.departmentId - 1].title,
//   }));
// }

export function getAllEmployees() {
  if (localStorage.getItem(KEYS.employees) == null)
    localStorage.setItem(KEYS.employees, JSON.stringify([]));
  return JSON.parse(localStorage.getItem(KEYS.employees));
}

export function generateData() {
  insertEmployee({
    fullName: "Jasper Lake",
    email: "test@test.com",
    mobile: "9995557732",
    city: "lagos",
    department: "Development",
  });
  insertEmployee({
    fullName: "Jenny Dake",
    email: "mall@test.com",
    mobile: "8885557732",
    city: "kuwait",
    department: "Accounting",
  });
  insertEmployee({
    fullName: "Kelly Lake",
    email: "two@test.com",
    mobile: "7775557732",
    city: "bahran",
    department: "Accounting",
  });
  insertEmployee({
    fullName: "Kunkle Lake",
    email: "nine@test.com",
    mobile: "2225557732",
    city: "new york",
    department: "Marketing",
  });
  insertEmployee({
    fullName: "Nelly Disc",
    email: "disc@test.com",
    mobile: "4445557732",
    city: "delhi",
    department: "HR",
  });
  insertEmployee({
    fullName: "Jenny Acosta",
    email: "acosta@test.com",
    mobile: "7235557732",
    city: "texas",
    department: "Marketing",
  });
  insertEmployee({
    fullName: "Leyla Benn",
    email: "benn@test.com",
    mobile: "6545557732",
    city: "mali",
    department: "Development",
  });
  insertEmployee({
    fullName: "Fiona Quin",
    email: "quin@test.com",
    mobile: "1235557732",
    city: "jena",
    department: "HR",
  });
  insertEmployee({
    fullName: "Thor Watson",
    email: "thor@test.com",
    mobile: "3335557732",
    city: "russia",
    department: "Marketing",
  });
}
