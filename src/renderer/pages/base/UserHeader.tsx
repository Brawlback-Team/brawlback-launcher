import Button from "@mui/material/Button";
import { Box } from "@mui/system";

import { UserMenu } from "@/containers/Header/UserMenu";
import { useAccount } from "@/lib/hooks/useAccount";
import { useToasts } from "@/lib/hooks/useToasts";
import TitleLogo from "@/styles/images/brawlback_textraw.png";

const UserHeader = () => {
  const currentUser = useAccount((store) => store.user);
  const { showError } = useToasts();
  return (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", height: "90px" }}>
      <Box sx={{ marginLeft: "15px", marginTop: "20px" }}>
        <img src={TitleLogo} height={60} />
      </Box>

      <Box sx={{ marginRight: "30px" }}>
        {currentUser ? (
          <UserMenu user={currentUser} handleError={showError} />
        ) : (
          <Button variant="outlined" onClick={() => console.log("login")}>
            Log in
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UserHeader;
