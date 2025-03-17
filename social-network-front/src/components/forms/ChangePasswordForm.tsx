import { DialogContent, TextField } from "@mui/material";
import { FormikProps } from "formik";

interface ChangePasswordFormProps {
  formikChangePassword: FormikProps<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ formikChangePassword }) => {
  return (
    <DialogContent>
      <TextField
        fullWidth
        required
        autoComplete="new-password"
        id="oldPassword"
        name="oldPassword"
        label="Old Password"
        type="password"
        value={formikChangePassword.values.oldPassword}
        onChange={formikChangePassword.handleChange}
        onBlur={formikChangePassword.handleBlur}
        error={
          formikChangePassword.touched.oldPassword &&
          Boolean(formikChangePassword.errors.oldPassword)
        }
        helperText={
          formikChangePassword.touched.oldPassword &&
          formikChangePassword.errors.oldPassword
        }
        margin="normal"
      />
      <TextField
        fullWidth
        required
        id="newPassword"
        name="newPassword"
        label="New Password"
        type="password"
        autoComplete="new-password"
        value={formikChangePassword.values.newPassword}
        onChange={formikChangePassword.handleChange}
        onBlur={formikChangePassword.handleBlur}
        error={
          formikChangePassword.touched.newPassword &&
          Boolean(formikChangePassword.errors.newPassword)
        }
        helperText={
          formikChangePassword.touched.newPassword &&
          formikChangePassword.errors.newPassword
        }
        margin="normal"
      />
      <TextField
        fullWidth
        required
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        value={formikChangePassword.values.confirmPassword}
        onChange={formikChangePassword.handleChange}
        onBlur={formikChangePassword.handleBlur}
        error={
          formikChangePassword.touched.confirmPassword &&
          Boolean(formikChangePassword.errors.confirmPassword)
        }
        helperText={
          formikChangePassword.touched.confirmPassword &&
          formikChangePassword.errors.confirmPassword
        }
        margin="normal"
      />
    </DialogContent>
  );
};

export default ChangePasswordForm;
