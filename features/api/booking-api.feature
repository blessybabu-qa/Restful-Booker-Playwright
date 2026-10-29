Feature: Booking API
  As a hotel guest
  I want to make a booking
  So that my stay is reserved

  Scenario: Create a booking and check it is saved
    Given I have valid booking details
    When I create the booking
    Then the booking is created
    And the booking is saved with the same details

  Scenario: Update an existing booking
    Given a booking already exists
    And I have valid booking details
    When I update the booking
    Then the booking is updated with the new details

  Scenario: Delete a booking
    Given a booking already exists
    When I delete the booking
    Then the booking can no longer be found
