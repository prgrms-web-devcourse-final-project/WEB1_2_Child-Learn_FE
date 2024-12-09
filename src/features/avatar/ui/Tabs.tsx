import React from "react";
import styled from "styled-components";

type TabType = "background" | "pet" | "hat";

interface TabsProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => (
      <TabWrapper>
        <Tab onClick={() => setActiveTab("background")} active={activeTab === "background"}>
          배경
        </Tab>
        <Tab onClick={() => setActiveTab("pet")} active={activeTab === "pet"}>
          펫
        </Tab>
        <Tab onClick={() => setActiveTab("hat")} active={activeTab === "hat"}>
          모자
        </Tab>
      </TabWrapper>
)

export default Tabs;

const TabWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 20px 0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 10px;
   border: 0.5px solid ${(props) => (props.active ? "#50B498" : "#E3E3E3")};
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#50B498" : "#fff")};
  color: ${(props) => (props.active ? "white" : "#50B498")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#468585" : "#fff")};
  }
`;