package com.array;
import java.util.*;

public class Repeat {
    public static void main(String[] args) {

        int a[] = {1, 2, 3, 4, 3, 2};

        ArrayList<Integer> r = new ArrayList<>();

        for(int i = 0; i < a.length; i++) {

            for(int j = i + 1; j < a.length; j++) {

                if(a[i] == a[j] && !r.contains(a[i])) {
                    r.add(a[i]);
                }
            }
        }

        System.out.println(r);
    }
}
