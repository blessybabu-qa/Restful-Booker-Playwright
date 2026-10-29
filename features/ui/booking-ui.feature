Feature: Room booking
  As a hotel guest
  I want to book a room on the website
  So that I have a place to stay

  Scenario: Guest books a room
    Given I am on the home page
    When I choose a room
    And I select my check-in and check-out dates
    And I reserve the room with my details
    Then I see that my booking is confirmed
