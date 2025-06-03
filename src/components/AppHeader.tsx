
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Phone } from 'lucide-react';
import { 
  Avatar as UIAvatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';

const AppHeader = () => {
  return (
    <header className="border-b bg-white h-16 flex items-center justify-between px-4">
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 w-64 h-9 bg-gray-100 border-0"
          />
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="h-5 w-5 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <UIAvatar className="h-9 w-9 border">
          <AvatarImage src="" />
          <AvatarFallback>JD</AvatarFallback>
        </UIAvatar>
      </div>
    </header>
  );
};

export default AppHeader;
