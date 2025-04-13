import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FormLabel } from "@mui/material";

function createData(name, phone) {
  return { name, phone };
}

const rows = [
  createData("Leonardo Pinto", "61997206592"),
  createData("Ryan Azevedo", "95980629783"),
  createData("Breno Lima", "82999717714"),
  createData("Victor Araujo", "21979293814"),
  createData("André Lima", "49986960133"),
];

const ProfessionalGroup = () => {
  return (
    <>
      <FormLabel component="legend" sx={{ mb: 2 }}>
        Profissionais
      </FormLabel>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", border: "1px solid #E0E0E0" }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Nome</TableCell>
              <TableCell align="center">Telefone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center"> {row.name} </TableCell>
                <TableCell align="center">{row.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProfessionalGroup;
