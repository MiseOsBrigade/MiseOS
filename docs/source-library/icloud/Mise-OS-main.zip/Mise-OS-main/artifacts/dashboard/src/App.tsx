import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Landing from "@/pages/landing";
import Overview from "@/pages/overview";
import JobsList from "@/pages/jobs/index";
import JobDetail from "@/pages/jobs/detail";
import Approvals from "@/pages/approvals";
import DepartmentsList from "@/pages/departments/index";
import DepartmentDetail from "@/pages/departments/detail";
import Characters from "@/pages/characters";
import Brigade from "@/pages/brigade";
import Cards from "@/pages/cards";
import Ecosystem from "@/pages/ecosystem";
import Kitchen from "@/pages/kitchen";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Landing — full-screen cinematic, no sidebar */}
      <Route path="/" component={Landing} />

      {/* Control Plane — all wrapped in sidebar layout */}
      <Route path="/overview">
        <Layout><Overview /></Layout>
      </Route>
      <Route path="/kitchen">
        <Layout><Kitchen /></Layout>
      </Route>
      <Route path="/ecosystem">
        <Layout><Ecosystem /></Layout>
      </Route>
      <Route path="/jobs">
        <Layout><JobsList /></Layout>
      </Route>
      <Route path="/jobs/:id">
        <Layout><JobDetail /></Layout>
      </Route>
      <Route path="/approvals">
        <Layout><Approvals /></Layout>
      </Route>
      <Route path="/departments">
        <Layout><DepartmentsList /></Layout>
      </Route>
      <Route path="/departments/:id">
        <Layout><DepartmentDetail /></Layout>
      </Route>
      <Route path="/characters">
        <Layout><Characters /></Layout>
      </Route>
      <Route path="/brigade">
        <Layout><Brigade /></Layout>
      </Route>
      <Route path="/cards">
        <Layout><Cards /></Layout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <div className="scanline" />
          <div className="crt-noise" />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
