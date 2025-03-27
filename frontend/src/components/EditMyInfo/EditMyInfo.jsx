import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  forwardRef,
  useState,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { UserContext } from "../../UserContext";

const EditMyInfo = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const resolve = useRef(null);

  useImperativeHandle(ref, () => ({
    edit: () => {
      console.log(user);
      setOpen(true);
      // Reset fields
      setEmail(user.email);
      setFirstName(user.first_name);
      setLastName(user.last_name);

      const promise = new Promise((res) => {
        resolve.current = res;
      });
      return promise;
    },
  }));

  function handleCancel() {
    setOpen(false);
    resolve.current(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    resolve.current({ email, firstName, lastName });
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Edit My Info</DialogTitle>
      <DialogContent>
        <form action="#" onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#e88a1d",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#e88a1d" },
              }}
              type="submit"
            >
              Update
            </Button>
            <Button sx={{ color: "#e88a1d" }} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

export default EditMyInfo;
