from random import randint
import time

def game(r):
    chosen_number = None

    random_number = randint(r[0], r[-1])

    start = time.time()

    counter = 0

    while chosen_number != random_number:
        try:
            chosen_number = int(input(
            f"Guess the number between "
            f"{r[0]} and {r[-1]}: "))
            counter += 1

            if chosen_number > random_number:
                # If the guess is within 5 of the random number, notify the player they're close
                if abs(chosen_number - random_number) <= 5:
                    print("You are too close! Choose a lower number")
                else:
                    print("Too high, choose a lower number")
                print()

            elif chosen_number < random_number:
                # If the guess is within 5 of the random number, notify the player they're close
                if abs(chosen_number - random_number) <= 5:
                    print("You are too close! Choose a higher number")
                else:
                    print("Too low, choose a higher number")
                print()

        except ValueError:
            print("Error : enter a valid number")
            print()

    end = time.time()
    duration = round(end - start)

    if counter > 1:
        return f"Congrats, you guessed the number in {duration} seconds and {counter} tries"

    else:
        return f"Congrats, you guessed the number in {duration} seconds and {counter} try"

def menu():
    current_range = range(1,51)

    while True:
        print("\n=== Main Menu ===")
        print("1. Play the game")
        print("2. Select difficulty")
        print("3. Quit")
        print()
        choice = input("Choose an option: ")

        if choice == '1':
            while True:
                print(game(current_range))
                print()

                while True:
                    again = input("Do you want to play again? (yes/no): ").lower()

                    if again == 'yes':
                        break

                    elif again == 'no':
                        break

                    else:
                        print("Please type yes or no")
                        print()

                if again == 'no':
                    break

        elif choice == '2':
            current_range = difficulty(current_range)

        elif choice == '3':
            while True:
                confirm = input("Are you sure? (yes/no): ").lower()

                if confirm == 'yes':
                    print("Goodbye!")
                    return

                elif confirm == 'no':
                    break

                else:
                    print("Invalid choice, try again")
                    print()

        else:
            print("Invalid choice, try again")

def difficulty(r):
    if r[0] == 1 and r[-1] == 20:
        print("\nThe current difficulty is set to easy")
        print()

    elif r[0] == 1 and r[-1] == 50:
        print("\nThe current difficulty is set to medium")
        print()

    elif r[0] == 1 and r[-1] == 100:
        print("\nThe current difficulty is set to hard")
        print()

    while True:
        confirm = input("Change difficulty? (yes/no): ").lower()

        if confirm == 'yes':
            print("\n=== Difficulty selection ===")
            print("1. Easy")
            print("2. Medium")
            print("3. Hard")
            print()
            level = input("Choose a difficulty: ")

            if level == '1':
                print("The difficulty has been set to easy")
                return range(1,21)

            elif level == '2':
                print("The difficulty has been set to medium")
                return range(1,51)

            elif level == '3':
                print("The difficulty has been set to hard")
                return range(1,101)

            else:
                print("Invalid choice, try again\n")

        elif confirm == 'no':
            print("The difficulty has not been changed")
            return r

        else:
            print("Error: please type yes or no\n")

menu()