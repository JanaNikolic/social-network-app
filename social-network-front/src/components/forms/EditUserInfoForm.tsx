import { DialogContent, TextField, Box } from "@mui/material";
import { FormikProps } from "formik";

interface EditUserInfoFormProps {
  formikEditInfo: FormikProps<{
    name: string;
    lastname: string;
    username: string;
  }>;
}

const EditUserInfoForm: React.FC<EditUserInfoFormProps> = ({ formikEditInfo }) => {
  return (
    <DialogContent>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          fullWidth
          required
          id="name"
          name="name"
          label="Name"
          value={formikEditInfo.values.name}
          onChange={formikEditInfo.handleChange}
          onBlur={formikEditInfo.handleBlur}
          error={
            formikEditInfo.touched.name && Boolean(formikEditInfo.errors.name)
          }
          helperText={formikEditInfo.touched.name && formikEditInfo.errors.name}
          margin="normal"
          sx={{ width: "45%" }}
        />

        <TextField
          fullWidth
          required
          id="lastname"
          name="lastname"
          label="Last Name"
          value={formikEditInfo.values.lastname}
          onChange={formikEditInfo.handleChange}
          onBlur={formikEditInfo.handleBlur}
          error={
            formikEditInfo.touched.lastname &&
            Boolean(formikEditInfo.errors.lastname)
          }
          helperText={
            formikEditInfo.touched.lastname && formikEditInfo.errors.lastname
          }
          margin="normal"
          sx={{ width: "50%" }}
        />
      </Box>
      <TextField
        fullWidth
        required
        id="username"
        name="username"
        label="Username"
        value={formikEditInfo.values.username}
        onChange={formikEditInfo.handleChange}
        onBlur={formikEditInfo.handleBlur}
        error={
          formikEditInfo.touched.username &&
          Boolean(formikEditInfo.errors.username)
        }
        helperText={
          formikEditInfo.touched.username && formikEditInfo.errors.username
        }
        margin="normal"
      />
    </DialogContent>
  );
};

export default EditUserInfoForm;
