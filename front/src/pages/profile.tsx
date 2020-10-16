/* prettier-ignore */
import { Box, Heading, Stack, Stat, StatLabel, StatNumber, Tab, TabList, TabPanel, TabPanels, Tabs,} from "@chakra-ui/core";
import React from "react";
import CardReviewSettingsForm from "../forms/CardReviewSettingsForm";
import ProfileSettingsForm from "../forms/ProfileSettingsForm";
import {
  ReviewStatistic,
  ReviewStatisticSnippetFragment,
  useProfileInfoQuery,
} from "../generated/graphql";

const formatReviewStatistic = (stat: ReviewStatisticSnippetFragment): string => {
  const totalCorrect = Math.round(stat.correctFraction * stat.reviewCount);
  return `${totalCorrect}/${stat.reviewCount}`;
};

const Profile: React.FC<{}> = () => {
  const profileData = useProfileInfoQuery();

  if (profileData.loading) {
      return <></>;
  }
  const data = profileData.data!;

  return (
    <>
      <Box>
        <Heading>Recent Reviews</Heading>
        <Stack direction="row">
          <Stat>
            <StatLabel>Today</StatLabel>
            <StatNumber>
              {formatReviewStatistic(data.me.reviewHistory.today)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Last Week</StatLabel>
            <StatNumber>
              {formatReviewStatistic(data.me.reviewHistory.lastWeek)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Last Month</StatLabel>
            <StatNumber>
              {formatReviewStatistic(data.me.reviewHistory.lastMonth)}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Last Year</StatLabel>
            <StatNumber>
              {formatReviewStatistic(data.me.reviewHistory.lastYear)}
            </StatNumber>
          </Stat>
        </Stack>
      </Box>
      <Box>
        <Heading>Settings</Heading>
        <Tabs>
          <TabList>
            <Tab>Card Review</Tab>
            <Tab>Profile</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CardReviewSettingsForm settings={data.me.settings} />
            </TabPanel>
            <TabPanel>
              <ProfileSettingsForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Profile;
