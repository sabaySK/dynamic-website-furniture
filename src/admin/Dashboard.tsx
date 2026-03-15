import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard, Users, ShoppingBag, BookOpen, Clock, ArrowUpRight, TrendingUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Products",
    value: "128",
    change: "+12% from last month",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-100/50",
  },
  {
    title: "Active Categories",
    value: "14",
    change: "2 added recently",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-100/50",
  },
  {
    title: "Customer Stories",
    value: "45",
    change: "+5 this week",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-100/50",
  },
  {
    title: "New Inquiries",
    value: "12",
    change: "4 pending review",
    icon: MessageSquare,
    color: "text-orange-600",
    bg: "bg-orange-100/50",
  },
];

const recentActivity = [
  { action: "Product Added", details: "Nordic Linen Sofa (Light Gray)", time: "2 hours ago", user: "Admin" },
  { action: "Category Updated", details: "Living Room Furniture", time: "5 hours ago", user: "Editor" },
  { action: "New Story Approved", details: "Marcus T. - Artisan Dining Table", time: "Yesterday", user: "Admin" },
  { action: "Banner Reordered", details: "Homepage Hero Carousel", time: "2 days ago", user: "Admin" },
];

const Dashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 md:p-8 space-y-12 animate-in fade-in duration-500 w-full max-w-none mx-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">
            Welcome back! Here's what's happening with your website today.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-lg shadow-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium font-body">{currentDate}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="overflow-hidden border-primary/5 hover:border-primary/20 transition-all hover:shadow-md group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium font-body text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-md group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display">{stat.value}</div>
              <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-display font-semibold">Recent Activity</CardTitle>
                <CardDescription className="font-body">Latest changes made across the platform.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-body group">
                View All <ArrowUpRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium font-body leading-none">
                      {activity.action}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">— {activity.user}</span>
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      {activity.details}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground font-body whitespace-nowrap italic">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-primary/5">
          <CardHeader>
            <CardTitle className="text-lg font-display font-semibold">Quick Actions</CardTitle>
            <CardDescription className="font-body">Common management tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="w-full justify-start font-body h-10 border-primary/10 hover:bg-primary/5">
              <ShoppingBag className="mr-2 h-4 w-4 text-primary" />
              Add New Product
            </Button>
            <Button variant="outline" className="w-full justify-start font-body h-10 border-primary/10 hover:bg-primary/5">
              <BookOpen className="mr-2 h-4 w-4 text-primary" />
              Manage Categories
            </Button>
            <Button variant="outline" className="w-full justify-start font-body h-10 border-primary/10 hover:bg-primary/5">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Review Testimonials
            </Button>
            <Button variant="outline" className="w-full justify-start font-body h-10 border-primary/10 hover:bg-primary/5">
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              View Site Preview
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Decorative background accent */}
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
};

export default Dashboard;
