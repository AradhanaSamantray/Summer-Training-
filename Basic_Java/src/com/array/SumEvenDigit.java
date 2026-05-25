package com.array;
import java.util.Scanner;
public class SumEvenDigit {

        public static void main(String[] args) {

            Scanner sc = new Scanner(System.in);

            System.out.print("Enter size: ");
            int n = sc.nextInt();

            int arr[] = new int[n];

            System.out.println("Enter elements:");

            for(int i = 0; i < n; i++) {
                arr[i] = sc.nextInt();
            }

            System.out.print("Output: {");

            for(int i = 0; i < n; i++) {

                int num = arr[i];
                int sum = 0;

                while(num > 0) {

                    int digit = num % 10;

                    if(digit % 2 == 0)
                        sum += digit;

                    num /= 10;
                }

                System.out.print(sum);

                if(i < n - 1)
                    System.out.print(", ");
            }

            System.out.println("}");

            sc.close();
        }
}

