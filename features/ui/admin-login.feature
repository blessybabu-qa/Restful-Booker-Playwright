Feature: Admin login
  As a hotel admin
  I want to log in to the admin panel
  So that I can manage rooms and bookings

  Scenario: Admin logs in with correct details
    Given I am on the admin login page
    When I log in with the admin details
    Then I see the admin panel

  Scenario Outline: Admin cannot log in with wrong details
    Given I am on the admin login page
    When I log in with username "<username>" and password "<password>"
    Then I see an invalid credentials message

    Examples:
      | username  | password  |
      | wronguser | wrongpass |
      |           |           |
