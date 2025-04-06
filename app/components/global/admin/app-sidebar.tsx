import * as React from 'react'
  import { ChevronRight, type LucideIcon } from 'lucide-react'
import { dashboardConfig } from '~/config/dashboard'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '../../ui/sidebar'
import { NavUser } from './nav-user'
  
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
      <Sidebar {...props}>
        <SidebarHeader className="p-4 text-xl flex flex-row items-center gap-2">
          <img src={dashboardConfig.sidebar.logo.src} alt={dashboardConfig.sidebar.logo.alt} className="w-10 h-10 rounded-full" />
          <span className="text-xl font-medium">Admin Panel</span>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={dashboardConfig.sidebar.items} />
        </SidebarContent>
        <SidebarFooter>
        <NavUser user={dashboardConfig.sidebar.user} />
      </SidebarFooter>

      </Sidebar>
    )
  }
  
  export function NavMain({
    items,
  }: {
    items: {
      title: string
      url: string
      icon: LucideIcon
      isActive?: boolean
      items?: {
        title: string
        url: string
      }[]
      disabled?: boolean
    }[]
  }) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title} disabled={item.disabled}>
                  <a
                    href={item.disabled ? '#' : item.url}
                    data-disabled={item.disabled}
                    className="data-[disabled=true]:opacity-50"
                  >
                    <item.icon className="text-muted-foreground" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }
  