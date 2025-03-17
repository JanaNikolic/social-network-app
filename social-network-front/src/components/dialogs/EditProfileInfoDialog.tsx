import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import userService from "../../services/UserService";
import EditUserInfoForm from "../forms/EditUserInfoForm";
import ChangePasswordForm from "../forms/ChangePasswordForm";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface EditProfileInfoDialogProps {
  open: boolean;
  handleClose: () => void;
  handleEditInfoSubmit: (data: any, message: string) => void;
  user: {
    name: string;
    lastname: string;
    username: string;
  } | null;
}

const EditProfileInfoDialog: React.FC<EditProfileInfoDialogProps> = ({
  open,
  handleClose,
  handleEditInfoSubmit,
  user,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formikEditInfo = useFormik({
    initialValues: {
      name: user?.name || "",
      lastname: user?.lastname || "",
      username: user?.username || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Minimum 3 characters").required("Required"),
      lastname: Yup.string().min(3, "Minimum 3 characters").required("Required"),
      username: Yup.string().min(3, "Minimum 3 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await userService.editUserInfo(values);
        handleEditInfoSubmit(data, "Info updated successfully!");
        formikEditInfo.resetForm();
        handleClose();
      } catch (err: any) {
        handleEditInfoSubmit(null, err.message);
      }
    },
  });

  const formikChangePassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().min(6, "Minimum 6 characters").required("Required"),
      newPassword: Yup.string().min(6, "Minimum 6 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await userService.changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
        handleEditInfoSubmit(null, "Password updated successfully!");
        formikChangePassword.resetForm();
        handleClose();
      } catch (err: any) {
        handleEditInfoSubmit(null, err.message);
        formikChangePassword.resetForm();
      }
    },
  });

  const handleCloseAndResetForms = () => {
    formikEditInfo.resetForm();
    formikChangePassword.resetForm();
    handleClose();
  };

  useEffect(() => {
    if (user) {
      formikEditInfo.setValues({
        name: user.name,
        lastname: user.lastname,
        username: user.username,
      });
    }
  }, [user, open]);

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit:
          tabValue === 0
            ? formikEditInfo.handleSubmit
            : formikChangePassword.handleSubmit,
      }}
    >
      <DialogTitle>Edit Profile</DialogTitle>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Edit Info" />
        <Tab label="Change Password" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <EditUserInfoForm formikEditInfo={formikEditInfo} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ChangePasswordForm formikChangePassword={formikChangePassword} />
      </TabPanel>
      <DialogActions>
        <Button
          onClick={handleCloseAndResetForms}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileInfoDialog;
